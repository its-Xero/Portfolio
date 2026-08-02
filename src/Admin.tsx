import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Trash2, Edit2, Eye, EyeOff, Plus, LogOut, Upload } from 'lucide-react';

const PROJECT_CATEGORIES = ['Graphic Design', 'UI/UX Design', 'Packaging Design', 'Branding Design'];
const LINKEDIN_API_URL = import.meta.env.VITE_LINKEDIN_API_URL || 'http://localhost:3001/api/linkedin-post';

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [linkedinPosts, setLinkedinPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({
    title: '', category: '', year: '', description: '', image: '', gallery_images: [], links: [], alt: '', visible: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [imageCropSettings, setImageCropSettings] = useState({ x: 50, y: 50, scale: 1 });
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
  const [galleryFileSlots, setGalleryFileSlots] = useState<(File | null)[]>([null, null, null, null]);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>(['', '', '', '']);
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [currentPost, setCurrentPost] = useState<any>({
    title: '',
    excerpt: '',
    read_time: 'LinkedIn post',
    date: '',
    image: '',
    alt: '',
    url: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProjects();
        fetchLinkedinPosts();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProjects();
        fetchLinkedinPosts();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching projects', error);
    } else {
      setProjects((data || []).map((project: any) => ({
        ...project,
        gallery_images: project.gallery_images || [],
        links: project.links || [],
      })));
    }
  };

  const fetchLinkedinPosts = async () => {
    const { data, error } = await supabase
      .from('linkedin_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching LinkedIn posts', error);
    else setLinkedinPosts(data || []);
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('projects')
      .update({ visible: !currentStatus })
      .eq('id', id);
    if (error) console.error(error);
    else fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) console.error(error);
    else fetchProjects();
  };

  const uploadImage = async (file: File | null) => {
    if (!file) return '';
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('portfolio_images').upload(fileName, file);
    if (uploadError) {
      throw new Error(uploadError.message);
    }
    const { data: publicUrlData } = supabase.storage.from('portfolio_images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const cropImageFileToCanvas = async (file: File, crop: { x: number; y: number; scale: number }, outputWidth = 1200) => {
    const loadImage = (source: string | File) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = typeof source === 'string' ? source : URL.createObjectURL(source);
      });

    const img = await loadImage(file);
    const ratio = 16 / 9;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    let srcWidth = naturalWidth;
    let srcHeight = naturalHeight;
    if (naturalWidth / naturalHeight > ratio) {
      srcHeight = naturalHeight / crop.scale;
      srcWidth = srcHeight * ratio;
    } else {
      srcWidth = naturalWidth / crop.scale;
      srcHeight = srcWidth / ratio;
    }

    const centerX = (crop.x / 100) * naturalWidth;
    const centerY = (crop.y / 100) * naturalHeight;
    let left = centerX - srcWidth / 2;
    let top = centerY - srcHeight / 2;

    left = Math.max(0, Math.min(left, naturalWidth - srcWidth));
    top = Math.max(0, Math.min(top, naturalHeight - srcHeight));

    const outputHeight = Math.round(outputWidth / ratio);
    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not available');

    ctx.drawImage(img, left, top, srcWidth, srcHeight, 0, 0, outputWidth, outputHeight);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    if (!blob) throw new Error('Failed to crop image');

    return new File([blob], file.name.replace(/\.[^/.]+$/, '') + '-cropped.jpg', { type: 'image/jpeg' });
  };

  const generateCropPreviewUrl = async (file: File, crop: { x: number; y: number; scale: number }) => {
    const croppedFile = await cropImageFileToCanvas(file, crop, 640);
    return URL.createObjectURL(croppedFile);
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = currentProject.image;

    if (imageFile) {
      try {
        const uploadFile = croppedImageFile || (imageCropSettings.x !== 50 || imageCropSettings.y !== 50 || imageCropSettings.scale !== 1
          ? await cropImageFileToCanvas(imageFile, imageCropSettings)
          : imageFile);
        imageUrl = await uploadImage(uploadFile);
      } catch (error: any) {
        alert(error.message);
        setLoading(false);
        return;
      }
    }

    const existingGalleryImages = currentProject.gallery_images || [];
    const galleryImageUrls: string[] = [];
    try {
      for (let index = 0; index < 4; index += 1) {
        if (galleryFileSlots[index]) {
          const uploadedUrl = await uploadImage(galleryFileSlots[index] as File);
          galleryImageUrls.push(uploadedUrl);
        } else if (existingGalleryImages[index]) {
          galleryImageUrls.push(existingGalleryImages[index]);
        }
      }
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const payload = {
      ...currentProject,
      image: imageUrl,
      gallery_images: galleryImageUrls,
      links: (currentProject.links || []).filter((link: any) => link.label && link.url),
    };

    if (currentProject.id) {
      // Update
      const { error } = await supabase.from('projects').update(payload).eq('id', currentProject.id);
      if (error) alert(error.message);
    } else {
      // Insert
      const { error } = await supabase.from('projects').insert([payload]);
      if (error) alert(error.message);
    }

    setLoading(false);
    setIsEditing(false);
    setCurrentProject({ title: '', category: '', year: '', description: '', image: '', gallery_images: [], links: [], alt: '', visible: true });
    setImageFile(null);
    setImagePreviewUrl('');
    setCroppedImageFile(null);
    setImageCropSettings({ x: 50, y: 50, scale: 1 });
    setGalleryFileSlots([null, null, null, null]);
    setGalleryPreviewUrls(['', '', '', '']);
    fetchProjects();
  };

  const fetchLinkedinPostMetadata = async (url: string) => {
    if (!url) throw new Error('Please enter a LinkedIn post URL first.');

    try {
      const fetchUrl = `${LINKEDIN_API_URL}?url=${encodeURIComponent(url)}`;
      console.log('Fetching from:', fetchUrl);
      
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.error) {
        throw new Error(payload.error || `Server returned ${response.status}: ${response.statusText}`);
      }

      if (!payload.title && !payload.image) {
        throw new Error('Could not extract LinkedIn post metadata. Please fill in the details manually.');
      }

      return payload;
    } catch (error: any) {
      console.error('LinkedIn metadata fetch error:', error);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Backend server not found at ${LINKEDIN_API_URL}. Make sure to run: npm run backend`);
      }
      
      throw error;
    }
  };

  const hydrateLinkedinPost = async () => {
    if (!currentPost.url) return;

    setLoading(true);

    try {
      const metadata = await fetchLinkedinPostMetadata(currentPost.url);

      setCurrentPost((prev: any) => ({
        ...prev,
        title: prev.title || metadata.title || 'LinkedIn post',
        excerpt: prev.excerpt || metadata.excerpt || metadata.description || '',
        date: prev.date || metadata.date || '',
        image: prev.image || metadata.image || '',
        alt: prev.alt || metadata.alt || metadata.title || 'LinkedIn post image',
      }));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveLinkedinPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = currentPost.image;
      if (postImageFile) {
        imageUrl = await uploadImage(postImageFile);
      }

      if (currentPost.url && (!currentPost.title || !currentPost.excerpt || !imageUrl)) {
        const metadata = await fetchLinkedinPostMetadata(currentPost.url);
        imageUrl = imageUrl || metadata.image || '';
        currentPost.title = currentPost.title || metadata.title || 'LinkedIn post';
        currentPost.excerpt = currentPost.excerpt || metadata.excerpt || metadata.description || '';
        currentPost.date = currentPost.date || metadata.date || '';
        currentPost.alt = currentPost.alt || metadata.alt || metadata.title || 'LinkedIn post image';
      }

      const payload = {
        ...currentPost,
        image: imageUrl,
        url: currentPost.url || currentPost.post_url || '',
      };

      if (currentPost.id) {
        const { error } = await supabase.from('linkedin_posts').update(payload).eq('id', currentPost.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from('linkedin_posts').insert([payload]);
        if (error) throw new Error(error.message);
      }

      setIsEditingPost(false);
      setCurrentPost({ title: '', excerpt: '', read_time: 'LinkedIn post', date: '', image: '', alt: '', url: '' });
      setPostImageFile(null);
      fetchLinkedinPosts();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLinkedinPost = async (id: string) => {
    if (!confirm('Delete this LinkedIn post entry?')) return;
    const { error } = await supabase.from('linkedin_posts').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchLinkedinPosts();
  };

  if (!session) {
    return (
      <div style={{ background: '#0A0A0A', minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5F5F5', fontFamily: 'Inter' }}>
        <form onSubmit={handleLogin} style={{ background: '#141414', padding: 40, borderRadius: 12, border: '1px solid #1F1F1F', width: 400 }}>
          <h2 style={{ margin: '0 0 24px', fontWeight: 500 }}>Admin Login</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#F5F5F5', color: '#0A0A0A', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .admin-shell { padding: 40px; }
        .admin-content { max-width: 1200px; margin: 0 auto; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #1F1F1F; gap: 16px; }
        .admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .admin-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .admin-list-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .admin-list-item { display: flex; align-items: center; gap: 20px; }
        @media (max-width: 760px) {
          .admin-shell { padding: 24px 16px; }
          .admin-header { flex-direction: column; align-items: flex-start; }
          .admin-form-grid { grid-template-columns: 1fr !important; }
          .admin-actions { flex-direction: column; }
          .admin-list-row { flex-direction: column; align-items: flex-start; }
          .admin-list-item { width: 100%; }
        }
      `}</style>
      <div className="admin-shell" style={{ background: '#0A0A0A', minHeight: '100svh', color: '#F5F5F5', fontFamily: 'Inter' }}>
      <div className="admin-content">
        <header className="admin-header">
          <h1 style={{ margin: 0, fontWeight: 400 }}>Admin Dashboard</h1>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid #1F1F1F', color: '#878787', padding: '8px 16px', borderRadius: 99, cursor: 'pointer' }}>
            <LogOut size={14} /> Logout
          </button>
        </header>

        {isEditing ? (
          <form onSubmit={saveProject} style={{ background: '#141414', padding: 30, borderRadius: 12, border: '1px solid #1F1F1F' }}>
            <h2 style={{ marginTop: 0 }}>{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Title</label>
                <input type="text" value={currentProject.title} onChange={e => setCurrentProject({...currentProject, title: e.target.value})} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Category</label>
                <select value={currentProject.category || ''} onChange={e => setCurrentProject({...currentProject, category: e.target.value})} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }}>
                  <option value="" disabled>Select a category</option>
                  {PROJECT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Year</label>
                <input type="text" value={currentProject.year} onChange={e => setCurrentProject({...currentProject, year: e.target.value})} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Main thumbnail</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#878787', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s', fontSize: 13 }}>
                  <Upload size={16} />
                  {imageFile ? imageFile.name.substring(0, 20) + '...' : currentProject.image ? 'Use existing image' : 'Choose image'}
                  <input type="file" onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    setCroppedImageFile(null);
                    setImageCropSettings({ x: 50, y: 50, scale: 1 });
                    if (file) setImagePreviewUrl(URL.createObjectURL(file));
                  }} accept="image/*" style={{ display: 'none' }} />
                </label>
                {imagePreviewUrl ? (
                  <div style={{ marginTop: 14, border: '1px solid #1F1F1F', borderRadius: 12, overflow: 'hidden', background: '#0A0A0A' }}>
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                      <img src={imagePreviewUrl} alt="Thumbnail preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 12 }}>
                      <div style={{ display: 'grid', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', color: '#878787', fontSize: 12, marginBottom: 6 }}>Center X</label>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={imageCropSettings.x}
                            onChange={async (e) => {
                              const next = { ...imageCropSettings, x: Number(e.target.value) };
                              setImageCropSettings(next);
                              if (imageFile) {
                                const previewUrl = await generateCropPreviewUrl(imageFile, next);
                                setImagePreviewUrl(previewUrl);
                              }
                            }}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#878787', fontSize: 12, marginBottom: 6 }}>Center Y</label>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={imageCropSettings.y}
                            onChange={async (e) => {
                              const next = { ...imageCropSettings, y: Number(e.target.value) };
                              setImageCropSettings(next);
                              if (imageFile) {
                                const previewUrl = await generateCropPreviewUrl(imageFile, next);
                                setImagePreviewUrl(previewUrl);
                              }
                            }}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', color: '#878787', fontSize: 12, marginBottom: 6 }}>Zoom</label>
                          <input
                            type="range"
                            min={1}
                            max={2}
                            step={0.05}
                            value={imageCropSettings.scale}
                            onChange={async (e) => {
                              const next = { ...imageCropSettings, scale: Number(e.target.value) };
                              setImageCropSettings(next);
                              if (imageFile) {
                                const previewUrl = await generateCropPreviewUrl(imageFile, next);
                                setImagePreviewUrl(previewUrl);
                              }
                            }}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button type="button" onClick={async () => {
                            if (!imageFile) return;
                            try {
                              const cropped = await cropImageFileToCanvas(imageFile, imageCropSettings);
                              setCroppedImageFile(cropped);
                              setImagePreviewUrl(URL.createObjectURL(cropped));
                            } catch (error: any) {
                              alert(error.message || 'Could not crop thumbnail');
                            }
                          }} style={{ padding: '10px 14px', background: '#F5F5F5', color: '#0A0A0A', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                            Apply crop
                          </button>
                          <button type="button" onClick={() => {
                            setCroppedImageFile(null);
                            setImageCropSettings({ x: 50, y: 50, scale: 1 });
                            if (imageFile) setImagePreviewUrl(URL.createObjectURL(imageFile));
                          }} style={{ padding: '10px 14px', background: 'transparent', color: '#F5F5F5', border: '1px solid #1F1F1F', borderRadius: 6, cursor: 'pointer' }}>
                            Reset crop
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Gallery images</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                  {Array.from({ length: 4 }).map((_, index) => {
                    const previewUrl = galleryPreviewUrls[index] || currentProject.gallery_images?.[index] || '';
                    return (
                      <div key={index} style={{ position: 'relative', minHeight: 100, borderRadius: 12, border: '1px solid #1F1F1F', background: '#0A0A0A' }}>
                        {previewUrl ? (
                          <img src={previewUrl} alt={`Gallery image ${index + 1}`} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 12 }} />
                        ) : (
                          <div style={{ width: '100%', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#878787', fontSize: 12, padding: 10, textAlign: 'center' }}>
                            {`Slot ${index + 1}`}
                          </div>
                        )}
                        <label style={{ position: 'absolute', left: 8, bottom: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#141414', border: '1px solid #1F1F1F', borderRadius: 999, color: '#F5F5F5', cursor: 'pointer', fontSize: 12 }}>
                          Change
                          <input type="file" onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setGalleryFileSlots(prev => {
                              const next = [...prev];
                              next[index] = file;
                              return next;
                            });
                            setGalleryPreviewUrls(prev => {
                              const next = [...prev];
                              next[index] = file ? URL.createObjectURL(file) : '';
                              return next;
                            });
                          }} accept="image/*" style={{ display: 'none' }} />
                        </label>
                        {(galleryFileSlots[index] || currentProject.gallery_images?.[index]) && (
                          <button type="button" onClick={() => {
                            setGalleryFileSlots(prev => {
                              const next = [...prev];
                              next[index] = null;
                              return next;
                            });
                            setGalleryPreviewUrls(prev => {
                              const next = [...prev];
                              next[index] = '';
                              return next;
                            });
                            if (currentProject.gallery_images?.[index]) {
                              setCurrentProject(prev => ({
                                ...prev,
                                gallery_images: prev.gallery_images?.filter((_: any, i: number) => i !== index) || [],
                              }));
                            }
                          }} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(10,10,10,0.9)', border: '1px solid #1F1F1F', color: '#F87171', borderRadius: 999, width: 28, height: 28, display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Description</label>
              <textarea value={currentProject.description} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box', minHeight: 100 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Project links (optional)</label>
              {(currentProject.links || []).map((link: any, index: number) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '0.35fr 1fr auto', gap: 8, marginBottom: 8 }}>
                  <input type="text" placeholder="Figma" value={link.label} onChange={e => setCurrentProject({ ...currentProject, links: currentProject.links.map((item: any, itemIndex: number) => itemIndex === index ? { ...item, label: e.target.value } : item) })} style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
                  <input type="url" placeholder="https://..." value={link.url} onChange={e => setCurrentProject({ ...currentProject, links: currentProject.links.map((item: any, itemIndex: number) => itemIndex === index ? { ...item, url: e.target.value } : item) })} style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setCurrentProject({ ...currentProject, links: currentProject.links.filter((_: any, itemIndex: number) => itemIndex !== index) })} style={{ padding: '0 12px', background: 'transparent', color: '#F87171', border: '1px solid #1F1F1F', borderRadius: 6, cursor: 'pointer' }} aria-label="Remove link">×</button>
                </div>
              ))}
              <button type="button" onClick={() => setCurrentProject({ ...currentProject, links: [...(currentProject.links || []), { label: '', url: '' }] })} style={{ padding: '8px 14px', background: 'transparent', color: '#F5F5F5', border: '1px solid #1F1F1F', borderRadius: 6, cursor: 'pointer' }}>
                <Plus size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Add link
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#F5F5F5', color: '#0A0A0A', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
                {loading ? 'Saving...' : 'Save Project'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#878787', border: '1px solid #1F1F1F', borderRadius: 6, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        ) : isEditingPost ? (
          <form onSubmit={saveLinkedinPost} style={{ background: '#141414', padding: 30, borderRadius: 12, border: '1px solid #1F1F1F' }}>
            <h2 style={{ marginTop: 0 }}>{currentPost.id ? 'Edit LinkedIn Post' : 'New LinkedIn Post'}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Title</label>
                <input type="text" value={currentPost.title} onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Read Time</label>
                <input type="text" value={currentPost.read_time} onChange={e => setCurrentPost({ ...currentPost, read_time: e.target.value })} style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Date</label>
                <input type="date" value={currentPost.date} onChange={e => setCurrentPost({ ...currentPost, date: e.target.value })} style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box', cursor: 'pointer' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Main image</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#878787', borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s', fontSize: 13 }}>
                  <Upload size={16} />
                  {postImageFile ? postImageFile.name.substring(0, 20) + '...' : 'Choose image'}
                  <input type="file" onChange={e => setPostImageFile(e.target.files?.[0] || null)} accept="image/*" style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Excerpt</label>
              <textarea value={currentPost.excerpt} onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box', minHeight: 90 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>LinkedIn post URL</label>
              <input type="url" value={currentPost.url} onChange={e => setCurrentPost({ ...currentPost, url: e.target.value })} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
              <p style={{ color: '#878787', fontSize: 13, margin: '8px 0 0' }}>Paste the LinkedIn post link and the dashboard will try to fill the title, description, and thumbnail automatically.</p>
            </div>

            <div className="admin-actions">
              <button type="button" onClick={hydrateLinkedinPost} disabled={loading || !currentPost.url} style={{ padding: '10px 20px', background: 'transparent', color: '#F5F5F5', border: '1px solid #1F1F1F', borderRadius: 6, cursor: loading || !currentPost.url ? 'not-allowed' : 'pointer', opacity: loading || !currentPost.url ? 0.7 : 1 }}>
                {loading ? 'Fetching...' : 'Fetch from LinkedIn'}
              </button>
              <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#F5F5F5', color: '#0A0A0A', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
                {loading ? 'Saving...' : 'Save LinkedIn Post'}
              </button>
              <button type="button" onClick={() => setIsEditingPost(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#878787', border: '1px solid #1F1F1F', borderRadius: 6, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontWeight: 400 }}>Projects</h2>
              <button onClick={() => { setCurrentProject({ title: '', category: '', year: '', description: '', image: '', gallery_images: [], links: [], alt: '', visible: true }); setIsEditing(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5F5F5', color: '#0A0A0A', border: 'none', padding: '8px 16px', borderRadius: 99, fontWeight: 500, cursor: 'pointer' }}>
                <Plus size={16} /> Add Project
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 24 }}>
              <h2 style={{ margin: 0, fontWeight: 400 }}>LinkedIn Posts</h2>
              <button onClick={() => { setCurrentPost({ title: '', excerpt: '', read_time: 'LinkedIn post', date: '', image: '', alt: '', url: '' }); setIsEditingPost(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5F5F5', color: '#0A0A0A', border: 'none', padding: '8px 16px', borderRadius: 99, fontWeight: 500, cursor: 'pointer' }}>
                <Plus size={16} /> Add LinkedIn Post
              </button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {projects.map(project => (
                <div key={project.id} className="admin-list-row" style={{ background: '#141414', padding: 20, borderRadius: 12, border: '1px solid #1F1F1F' }}>
                  <div className="admin-list-item">
                    <img src={project.image} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: '#0A0A0A' }} />
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontWeight: 500 }}>{project.title}</h3>
                      <div style={{ color: '#878787', fontSize: 13 }}>{project.category} • {project.year}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => toggleVisibility(project.id, project.visible)} title={project.visible ? "Hide from portfolio" : "Show on portfolio"} style={{ background: 'transparent', border: '1px solid #1F1F1F', color: project.visible ? '#4ADE80' : '#878787', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
                      {project.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => { setCurrentProject({ ...project, gallery_images: project.gallery_images || [], links: project.links || [] }); setIsEditing(true); }} style={{ background: 'transparent', border: '1px solid #1F1F1F', color: '#878787', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteProject(project.id)} style={{ background: 'transparent', border: '1px solid #1F1F1F', color: '#F87171', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <div style={{ color: '#878787', textAlign: 'center', padding: 40 }}>No projects found. Add your first project!</div>}
            </div>

            <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
              {linkedinPosts.map(post => (
                <div key={post.id} className="admin-list-row" style={{ background: '#141414', padding: 20, borderRadius: 12, border: '1px solid #1F1F1F' }}>
                  <div className="admin-list-item">
                    <img src={post.image} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: '#0A0A0A' }} />
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontWeight: 500 }}>{post.title}</h3>
                      <div style={{ color: '#878787', fontSize: 13 }}>{post.date || 'No date'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => { setCurrentPost(post); setIsEditingPost(true); }} style={{ background: 'transparent', border: '1px solid #1F1F1F', color: '#878787', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteLinkedinPost(post.id)} style={{ background: 'transparent', border: '1px solid #1F1F1F', color: '#F87171', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {linkedinPosts.length === 0 && <div style={{ color: '#878787', textAlign: 'center', padding: 40 }}>No LinkedIn posts yet. Add one and it will appear on the homepage.</div>}
            </div>
          </>
        )}
      </div>
      </div>
    </>
  );
}
