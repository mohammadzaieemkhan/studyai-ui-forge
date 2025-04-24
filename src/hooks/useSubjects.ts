
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

type Subject = Database['public']['Tables']['subjects']['Row'];
type InsertSubject = Database['public']['Tables']['subjects']['Insert'];

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*');

      if (error) throw error;
      setSubjects(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (subject: InsertSubject) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subject)
        .select();

      if (error) throw error;
      if (data) {
        setSubjects(prev => [...prev, data[0]]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data) {
        setSubjects(prev => 
          prev.map(subject => 
            subject.id === id ? data[0] : subject
          )
        );
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject
  };
};
