
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubjects } from '@/hooks/useSubjects';
import { toast } from 'sonner';
import { Loader2, PlusCircle } from 'lucide-react';

const Subjects = () => {
  const { subjects, loading, error, fetchSubjects, createSubject, updateSubject, deleteSubject } = useSubjects();
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [editingSubject, setEditingSubject] = useState<string | null>(null);

  // Get the current user ID - would normally come from auth context
  // For now we'll use a placeholder
  const currentUserId = "user-id-placeholder";

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCreateSubject = async () => {
    if (!newSubject.name) {
      toast.error('Subject name is required');
      return;
    }

    await createSubject({
      name: newSubject.name,
      description: newSubject.description,
      user_id: currentUserId
    });

    setNewSubject({ name: '', description: '' });
    toast.success('Subject created successfully');
  };

  const handleUpdateSubject = async () => {
    if (editingSubject) {
      await updateSubject(editingSubject, {
        name: newSubject.name,
        description: newSubject.description
      });
      setNewSubject({ name: '', description: '' });
      setEditingSubject(null);
      toast.success('Subject updated successfully');
    }
  };

  const handleDeleteSubject = async (id: string) => {
    await deleteSubject(id);
    toast.success('Subject deleted successfully');
  };

  const cancelEdit = () => {
    setNewSubject({ name: '', description: '' });
    setEditingSubject(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Manage Subjects</span>
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <div className="flex-grow">
              <Input
                placeholder="Subject Name"
                value={newSubject.name}
                onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                className="mb-2 md:mb-0"
              />
            </div>
            <div className="flex-grow">
              <Input
                placeholder="Description (optional)"
                value={newSubject.description}
                onChange={(e) => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
                className="mb-2 md:mb-0"
              />
            </div>
            <div className="flex gap-2">
              {editingSubject ? (
                <>
                  <Button onClick={handleUpdateSubject}>Save Changes</Button>
                  <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                </>
              ) : (
                <Button onClick={handleCreateSubject} className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              )}
            </div>
          </div>

          {loading && subjects.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : subjects.length > 0 ? (
            <div className="space-y-3">
              {subjects.map(subject => (
                <div 
                  key={subject.id} 
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  style={{ 
                    borderLeft: subject.color_code ? `4px solid ${subject.color_code}` : undefined 
                  }}
                >
                  <div>
                    <h3 className="font-medium text-lg">{subject.name}</h3>
                    {subject.description && <p className="text-sm text-muted-foreground">{subject.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewSubject({ 
                          name: subject.name, 
                          description: subject.description || '' 
                        });
                        setEditingSubject(subject.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteSubject(subject.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No subjects found. Create your first subject to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subjects;
