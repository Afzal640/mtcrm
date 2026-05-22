import { supabase } from "../config/supabaseClient.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";

// ✅ CREATE PROJECT FROM LEAD
export const createProjectFromLead = async (req, res) => {
  try {
    const { leadId, assignedTo, service, deadline } = req.body;

    if (!assignedTo) {
      return res.status(400).json({ message: "Please select a production team member." });
    }

    // 1. Lead ka data lein
    const { data: lead, error: leadFetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadFetchError || !lead) return res.status(404).json({ message: "Lead not found" });

    // 1b. Lead ke files fetch karein
    const { data: leadFiles } = await supabase
      .from('files')
      .select('name, url, size, uploaded_by')
      .eq('lead_id', leadId);

    // Format files for projects table (JSONB array)
    const formattedFiles = (leadFiles || []).map(f => ({
      name: f.name,
      url: f.url,
      size: f.size,
      uploaded_by: f.uploaded_by,
      created_at: new Date()
    }));

    // 2. Project create karein
    const projectNotes = JSON.stringify({
      description: lead.notes || "",
      revenue: lead.budget || "",
      checklist: [],
      comments: []
    });

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([{
        client_name: lead.client_name,
        service: service || lead.service,
        assigned_to: assignedTo,
        deadline: deadline || lead.deadline || null,
        created_by: req.user.id,
        status: "not-started",
        progress: 0,
        notes: projectNotes
      }])
      .select()
      .single();

    if (projectError) throw projectError;

    // 3. Lead ka status update karein "closed-won"
    await supabase
      .from('leads')
      .update({ status: 'closed-won' })
      .eq('id', leadId);

    res.status(201).json({
      message: "Lead successfully converted to project",
      project: {
        ...project,
        clientName: project.client_name,
        _id: project.id
      }
    });
  } catch (err) {
    console.error("CONVERSION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const user = req.user;
    let query = supabase
      .from('projects')
      .select(`
        *,
        assignedTo:users!projects_assigned_to_fkey(id, name),
        createdBy:users!projects_created_by_fkey(id, name)
      `);

    if (user.role === "production") {
      query = query.eq('assigned_to', user.id);
    } else if (user.role === "sales") {
      query = query.eq('created_by', user.id);
    }
    // Admin sees all, no filter needed

    const { data, error } = await query;
    if (error) throw error;
    
    // Map snake_case to camelCase for frontend compatibility
    const mappedData = data.map(p => ({
      ...p,
      clientName: p.client_name,
      createdAt: p.created_at,
      _id: p.id // Also add _id for compatibility
    }));

    res.json(mappedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE PROJECT STATUS
export const updateProjectStatus = async (req, res) => {
  try {
    const { status, progress, notes, assignedTo } = req.body;

    // Fetch current project to check status
    const { data: currentProject } = await supabase
      .from('projects')
      .select('status')
      .eq('id', req.params.id)
      .single();

    if (currentProject && currentProject.status === 'completed' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Completed projects are locked and cannot be updated by team members." });
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (notes !== undefined) updateData.notes = notes;
    if (assignedTo !== undefined) updateData.assigned_to = assignedTo;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Map snake_case to camelCase
    res.json({
      ...data,
      clientName: data.client_name,
      _id: data.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ ADD PROJECT FILE (Simplified for now)
export const addProjectFile = async (req, res) => {
  try {
    const { url } = req.body;
    
    // SQL mein Array column (files) update karne ka tareeka
    // Pehle current files fetch karein phir append karein
    const { data: project } = await supabase
      .from('projects')
      .select('files, status')
      .eq('id', req.params.id)
      .single();

    if (project && project.status === 'completed' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Completed projects are locked and cannot be updated by team members." });
    }

    const newFile = { url, uploaded_by: req.user.name, created_at: new Date() };
    const updatedFiles = project.files ? [...project.files, newFile] : [newFile];

    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update({ files: updatedFiles })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleProjectFileUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    // 1. Supabase Storage mein upload karein aur URL lein
    const fileUrl = await uploadToSupabase(req.file);

    // 2. Is URL ko database mein project ke andar save karein
    const { data: project } = await supabase
      .from('projects')
      .select('files, status')
      .eq('id', req.params.id)
      .single();

    if (project && project.status === 'completed' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Completed projects are locked and cannot be updated by team members." });
    }

    const newFile = { 
        url: fileUrl, 
        uploaded_by: req.user.name, 
        name: req.file.originalname, // File ka asli naam
        created_at: new Date() 
    };
    
    const updatedFiles = project.files ? [...project.files, newFile] : [newFile];

    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update({ files: updatedFiles })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE PROJECT FILE (Admin Only)
export const deleteProjectFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "File URL zaroor hona chahiye" });
    }

    // 1. Project fetch karein
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('files')
      .eq('id', id)
      .single();

    if (fetchError || !project) {
      return res.status(404).json({ message: "Project nahi mila" });
    }

    const files = project.files || [];
    const updatedFiles = files.filter(f => f.url !== fileUrl);

    if (files.length === updatedFiles.length) {
      return res.status(404).json({ message: "File project mein nahi mili" });
    }

    // 2. Supabase Storage se delete karne ki koshish karein
    try {
      const urlParts = fileUrl.split("/");
      const storageFileName = urlParts[urlParts.length - 1];
      await supabase.storage.from("project-files").remove([storageFileName]);
    } catch (storageErr) {
      console.warn("Storage delete warning:", storageErr.message);
    }

    // 3. Database update karein
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({ files: updatedFiles })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;
    res.json(updatedProject);
  } catch (err) {
    console.error("Delete file error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { clientName, service, assignedTo, deadline, revenue, notes } = req.body;
    
    const projectNotes = JSON.stringify({
      description: notes || "",
      revenue: revenue || "",
      checklist: [],
      comments: []
    });

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        client_name: clientName,
        service,
        assigned_to: assignedTo,
        deadline,
        created_by: req.user.id,
        status: "not-started",
        progress: 0,
        notes: projectNotes
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({
      ...data,
      clientName: data.client_name,
      _id: data.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET PROJECT BY ID
export const getProjectById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        assignedTo:users!projects_assigned_to_fkey(id, name, email),
        createdBy:users!projects_created_by_fkey(id, name, email)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // Map fields for frontend compatibility
    res.json({
      ...data,
      clientName: data.client_name,
      createdAt: data.created_at,
      _id: data.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const { clientName, service, assignedTo, deadline, status, progress, requirements, notes } = req.body;
    
    const updateData = {};
    if (clientName) updateData.client_name = clientName;
    if (service) updateData.service = service;
    if (assignedTo) updateData.assigned_to = assignedTo;
    if (deadline) updateData.deadline = deadline;
    if (status) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      ...data,
      clientName: data.client_name,
      _id: data.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};