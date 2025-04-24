
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubjects } from '@/hooks/useSubjects';
import { toast } from 'sonner';

const Subjects = () => {
  const { subjects, loading, error, fetchSubjects, createSubject, updateSubject, deleteSubject } = useSubjects();
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  const [editingSubject, setEditingSubject] = useState<string | null>(null);

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
      user_id: 'current_user_id' // Replace with actual user ID
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

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Subject Name"
              value={newSubject.name}
              onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Description (optional)"
              value={newSubject.description}
              onChange={(e) => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
            />
            {editingSubject ? (
              <Button onClick={handleUpdateSubject}>Update</Button>
            ) : (
              <Button onClick={handleCreateSubject}>Create</Button>
            )}
          </div>

          {loading ? (
            <p>Loading subjects...</p>
          ) : (
            <div className="space-y-2">
              {subjects.map(subject => (
                <div key={subject.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <h3 className="font-semibold">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.description}</p>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewSubject({ name: subject.name, description: subject.description || '' });
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subjects;
