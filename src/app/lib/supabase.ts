import { createClient } from '@supabase/supabase-js';
import { StoneSlab } from '../data/stoneData';

// Retrieve credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all products/slabs from Supabase table 'slabs'
 */
export async function fetchSupabaseSlabs(): Promise<StoneSlab[] | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('slabs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, falling back to local dataset:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      // Map DB columns to StoneSlab interface
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        color: item.color,
        origin: item.origin,
        finishes: item.finishes || ['Polished'],
        dimensions: item.dimensions || '3000 x 1800 x 20 mm',
        thickness: item.thickness || '20 mm',
        priceTier: item.price_tier || '$$$$',
        price: item.price !== null ? Number(item.price) : undefined,
        unit: item.unit || 'Per Square Foot',
        inStockSlabs: item.in_stock_slabs ?? 10,
        bundleNumber: item.bundle_number || `LOT-${item.id}`,
        rarity: item.rarity || 'Signature',
        description: item.description || '',
        longDescription: item.long_description || '',
        image: item.image,
        bookmatchImage: item.bookmatch_image || undefined,
        applications: item.applications || ['Flooring', 'Wall Cladding'],
        featured: item.featured ?? false,
        specifications: item.specifications || {
          compressiveStrength: '210 MPa',
          waterAbsorption: '< 0.08%',
          density: '2.65 g/cm³',
          flexuralStrength: '40 MPa'
        }
      }));
    }

    return null;
  } catch (err) {
    console.error('Error fetching slabs from Supabase:', err);
    return null;
  }
}

/**
 * Add a new product/slab to Supabase table 'slabs'
 */
export async function addSupabaseSlab(slab: StoneSlab): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const payload = {
      id: slab.id,
      name: slab.name,
      category: slab.category,
      color: slab.color,
      origin: slab.origin,
      finishes: slab.finishes,
      dimensions: slab.dimensions,
      thickness: slab.thickness,
      price_tier: slab.priceTier,
      price: slab.price ?? null,
      unit: slab.unit ?? 'Per Square Foot',
      in_stock_slabs: slab.inStockSlabs,
      bundle_number: slab.bundleNumber,
      rarity: slab.rarity,
      description: slab.description,
      long_description: slab.longDescription,
      image: slab.image,
      bookmatch_image: slab.bookmatchImage || null,
      applications: slab.applications,
      featured: slab.featured,
      specifications: slab.specifications
    };

    const { error } = await supabase.from('slabs').upsert(payload);

    if (error) {
      console.error('Failed to add product to Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error adding product to Supabase:', err);
    return false;
  }
}

/**
 * Update an existing product/slab in Supabase
 */
export async function updateSupabaseSlab(slab: StoneSlab): Promise<boolean> {
  return addSupabaseSlab(slab);
}

/**
 * Delete a product/slab from Supabase table 'slabs'
 */
export async function deleteSupabaseSlab(id: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('slabs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete product from Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error deleting product from Supabase:', err);
    return false;
  }
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  city: string;
  message: string;
}

export interface BookingResult {
  success: boolean;
  error?: string;
}

/**
 * Submit a booking:
 *  1. Insert into Supabase `bookings` table
 *  2. Call Edge Function to send owner email via Resend
 */
export async function submitBooking(data: BookingData): Promise<BookingResult> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.' };
  }

  try {
    // 1. Save to database
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      product: data.product || null,
      quantity: data.quantity || null,
      city: data.city || null,
      message: data.message || null,
    };

    const { data: insertedRow, error: dbError } = await supabase
      .from('bookings')
      .insert(payload)
      .select()
      .single();

    if (dbError) {
      console.error('Supabase insert error:', dbError.message);
      return { success: false, error: dbError.message };
    }

    // 2. Trigger email via Edge Function
    const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || `${supabaseUrl}/functions/v1`;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    try {
      const emailRes = await fetch(`${functionsUrl}/send-booking-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({ ...insertedRow }),
      });

      if (!emailRes.ok) {
        const errBody = await emailRes.json().catch(() => ({}));
        console.warn('Email send failed (booking still saved):', errBody);
        // Don't fail the whole submission — data is already saved
      }
    } catch (emailErr) {
      console.warn('Could not reach email edge function (booking still saved):', emailErr);
    }

    return { success: true };
  } catch (err) {
    console.error('submitBooking error:', err);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Upload an image file to Supabase storage bucket 'products'
 */
export async function uploadProductImage(file: File): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    // Ensure file is an image
    if (!file.type.startsWith('image/')) {
      console.warn('File is not an image');
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file to Supabase storage:', error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.error('Error in uploadProductImage:', err);
    return null;
  }
}

// ─── Admin Authentication & Password Reset ─────────────────────────────────

/**
 * Base utility to call the supabase edge function for administrative auth actions
 */
async function callAdminAuth(action: string, payload: any) {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const functionsUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || `${url}/functions/v1`;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const res = await fetch(`${functionsUrl}/admin-auth/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
      'apikey': anonKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to perform action ${action}`);
  }
  return data;
}

/**
 * Login administrative user securely using database hashing check
 */
export async function loginAdmin(username: string, password: string): Promise<{ success: boolean }> {
  return callAdminAuth('login', { username, password });
}

/**
 * Request an OTP verification code sent to the owner's phone
 */
export async function sendAdminOTP(usernameOrEmail: string): Promise<{ success: boolean; sandbox?: boolean; otp?: string; message?: string }> {
  return callAdminAuth('send-otp', { username_or_email: usernameOrEmail });
}

/**
 * Verify OTP code code entered by the owner
 */
export async function verifyAdminOTP(usernameOrEmail: string, otp: string): Promise<{ success: boolean; reset_token: string }> {
  return callAdminAuth('verify-otp', { username_or_email: usernameOrEmail, otp });
}

/**
 * Reset password using the valid reset token
 */
export async function resetAdminPassword(usernameOrEmail: string, token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  return callAdminAuth('reset-password', {
    username_or_email: usernameOrEmail,
    reset_token: token,
    new_password: newPassword
  });
}

