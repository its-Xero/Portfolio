import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Trash2, Edit2, Eye, EyeOff, Plus, LogOut } from 'lucide-react';

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
    title: '', category: '', year: '', description: '', alt: '', visible: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [webhookPayload, setWebhookPayload] = useState('');
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
    if (error) console.error('Error fetching projects', error);
    else setProjects(data || []);
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
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('portfolio_images').upload(fileName, file);
    if (uploadError) {
      throw new Error(uploadError.message);
    }
    const { data: publicUrlData } = supabase.storage.from('portfolio_images').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = currentProject.image;

    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error: any) {
        alert(error.message);
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...currentProject,
      image: imageUrl,
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
    setCurrentProject({ title: '', category: '', year: '', description: '', alt: '', visible: true });
    setImageFile(null);
    fetchProjects();
  };

  const saveLinkedinPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = currentPost.image;
      if (postImageFile) {
        imageUrl = await uploadImage(postImageFile);
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

  const importWebhookPayload = async () => {
    if (!webhookPayload.trim()) return;
    setLoading(true);

    try {
      const parsed = JSON.parse(webhookPayload);
      const payloadData = parsed.payload || parsed.data || parsed;
      const payload = {
        title: payloadData.title || payloadData.post_title || 'LinkedIn post',
        excerpt: payloadData.excerpt || payloadData.summary || payloadData.description || '',
        read_time: payloadData.read_time || 'LinkedIn post',
        date: payloadData.date || payloadData.published_at || new Date().toISOString().slice(0, 10),
        image: payloadData.image || payloadData.preview_image || payloadData.thumbnail || '',
        alt: payloadData.alt || payloadData.title || 'LinkedIn post image',
        url: payloadData.url || payloadData.post_url || payloadData.link || '',
      };

      if (!payload.url) throw new Error('The payload must include a URL field for the LinkedIn post.');

      const { error } = await supabase.from('linkedin_posts').insert([payload]);
      if (error) throw new Error(error.message);

      setWebhookPayload('');
      fetchLinkedinPosts();
    } catch (error: any) {
      alert(error.message || 'Could not import the webhook payload.');
    } finally {
      setLoading(false);
    }
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
    <div style={{ background: '#0A0A0A', minHeight: '100svh', color: '#F5F5F5', fontFamily: 'Inter', padding: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingBottom: 20, borderBottom: '1px solid #1F1F1F' }}>
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
                <input type="text" value={currentProject.category} onChange={e => setCurrentProject({...currentProject, category: e.target.value})} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Year</label>
                <input type="text" value={currentProject.year} onChange={e => setCurrentProject({...currentProject, year: e.target.value})} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Image Upload</label>
                <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" style={{ width: '100%', color: '#878787' }} />
              </div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Description</label>
              <textarea value={currentProject.description} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box', minHeight: 100 }} />
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
                <input type="text" value={currentPost.date} onChange={e => setCurrentPost({ ...currentPost, date: e.target.value })} style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Main image</label>
                <input type="file" onChange={e => setPostImageFile(e.target.files?.[0] || null)} accept="image/*" style={{ width: '100%', color: '#878787' }} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>Excerpt</label>
              <textarea value={currentPost.excerpt} onChange={e => setCurrentPost({ ...currentPost, excerpt: e.target.value })} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box', minHeight: 90 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, color: '#878787', marginBottom: 8 }}>LinkedIn post URL</label>
              <input type="url" value={currentPost.url} onChange={e => setCurrentPost({ ...currentPost, url: e.target.value })} required style={{ width: '100%', padding: 10, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 6, boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
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
              <button onClick={() => { setCurrentProject({ title: '', category: '', year: '', description: '', alt: '', visible: true }); setIsEditing(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5F5F5', color: '#0A0A0A', border: 'none', padding: '8px 16px', borderRadius: 99, fontWeight: 500, cursor: 'pointer' }}>
                <Plus size={16} /> Add Project
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 24 }}>
              <h2 style={{ margin: 0, fontWeight: 400 }}>LinkedIn Posts</h2>
              <button onClick={() => { setCurrentPost({ title: '', excerpt: '', read_time: 'LinkedIn post', date: '', image: '', alt: '', url: '' }); setIsEditingPost(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5F5F5', color: '#0A0A0A', border: 'none', padding: '8px 16px', borderRadius: 99, fontWeight: 500, cursor: 'pointer' }}>
                <Plus size={16} /> Add LinkedIn Post
              </button>
            </div>

            <div style={{ background: '#141414', border: '1px solid #1F1F1F', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 8px', fontWeight: 500 }}>Webhook / automation import</h3>
              <p style={{ margin: '0 0 12px', color: '#878787', fontSize: 13 }}>Paste a JSON payload from Opla, ViaSocket, or another webhook automation. The dashboard will save the LinkedIn URL, image, and text into the database.</p>
              <textarea value={webhookPayload} onChange={e => setWebhookPayload(e.target.value)} placeholder='{"title":"...","url":"https://www.linkedin.com/...","image":"https://...","excerpt":"..."}' style={{ width: '100%', minHeight: 120, padding: 12, background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#F5F5F5', borderRadius: 8, boxSizing: 'border-box', resize: 'vertical' }} />
              <button type="button" onClick={importWebhookPayload} disabled={loading} style={{ marginTop: 12, padding: '10px 16px', background: '#F5F5F5', color: '#0A0A0A', border: 'none', borderRadius: 6, fontWeight: 500, cursor: 'pointer' }}>
                Import webhook payload
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: 16 }}>
              {projects.map(project => (
                <div key={project.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: 20, borderRadius: 12, border: '1px solid #1F1F1F' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
                    <button onClick={() => { setCurrentProject(project); setIsEditing(true); }} style={{ background: 'transparent', border: '1px solid #1F1F1F', color: '#878787', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
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
                <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: 20, borderRadius: 12, border: '1px solid #1F1F1F' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
  );
}
