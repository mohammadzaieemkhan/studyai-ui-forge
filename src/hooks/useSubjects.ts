
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';

// Updated Subject type to match the actual database schema
type Subject = {
  subject_id: number;
  name: string;
  color_code?: string | null;
  icon_name?: string | null;
  description?: string | null;
};

type InsertSubject = {
  name: string;
  color_code?: string | null;
  icon_name?: string | null;
  description?: string | null;
  user_id?: string | null;
};

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
      setSubjects(data as Subject[] || []);
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
        setSubjects(prev => [...prev, data[0] as Subject]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id: number, updates: Partial<Subject>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('subject_id', id)
        .select();

      if (error) throw error;
      if (data) {
        setSubjects(prev => 
          prev.map(subject => 
            subject.subject_id === id ? data[0] as Subject : subject
          )
        );
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('subject_id', id);

      if (error) throw error;
      setSubjects(prev => prev.filter(subject => subject.subject_id !== id));
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
