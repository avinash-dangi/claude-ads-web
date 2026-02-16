'use client';

import { useState, useEffect } from 'react';
import { useAuditStore } from '@/store/audit-store';
import { BUSINESS_TYPES } from '@/types/business';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Plus, FolderOpen, Save } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  website: string;
}

export default function BusinessInfoStep() {
  const { formData, updateBusinessInfo, setCurrentProjectId, saveDraft } = useAuditStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('projects')
      .select('id, name, website')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setProjects(data);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    const result = await saveDraft();
    setSaving(false);
    if (!result.error) {
      alert('Draft saved successfully!');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: newProjectName,
        website: formData.businessInfo?.website || '',
        business_type: formData.businessInfo?.type || 'generic',
      })
      .select()
      .single();

    if (!error && data) {
      setCurrentProjectId(data.id);
      setProjects([data, ...projects]);
      setShowNewProject(false);
      setNewProjectName('');
    }
  };

  const handleSelectProject = (projectId: string | null) => {
    setCurrentProjectId(projectId);
  };

  return (
    <div className="space-y-6">
      {/* Project Selection */}
      <div className="space-y-2">
        <Label>Project</Label>
        <div className="flex gap-2">
          <select
            className="flex-1 p-2 border rounded-md bg-white"
            value={useAuditStore.getState().currentProjectId || ''}
            onChange={(e) => handleSelectProject(e.target.value || null)}
          >
            <option value="">New Audit</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowNewProject(!showNewProject)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {showNewProject && (
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <Button onClick={handleCreateProject}>Create</Button>
          </div>
        )}
      </div>

      {/* Save Draft Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={saving}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Draft'}
        </Button>
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          placeholder="Enter your business name"
          value={formData.businessInfo?.name || ''}
          onChange={(e) => updateBusinessInfo({ name: e.target.value })}
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://example.com"
          value={formData.businessInfo?.website || ''}
          onChange={(e) => updateBusinessInfo({ website: e.target.value })}
        />
      </div>

      {/* Business Type */}
      <div className="space-y-3">
        <Label>Business Type *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BUSINESS_TYPES.map((type) => (
            <Card
              key={type.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.businessInfo?.type === type.value
                  ? 'ring-2 ring-blue-600 bg-blue-50'
                  : 'hover:border-blue-300'
              }`}
              onClick={() => updateBusinessInfo({ type: type.value })}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <CardDescription className="font-medium text-slate-900">
                    {type.label}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
