
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES public.analyses(id) ON DELETE CASCADE NOT NULL,
  task_title text NOT NULL,
  task_description text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  status text NOT NULL DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'Done')),
  linked_heuristic_name text NOT NULL DEFAULT '',
  impact text NOT NULL DEFAULT 'Medium' CHECK (impact IN ('High', 'Medium', 'Low')),
  effort text NOT NULL DEFAULT 'Medium' CHECK (effort IN ('High', 'Medium', 'Low')),
  kpi_impact text,
  risk_level text NOT NULL DEFAULT 'Medium' CHECK (risk_level IN ('High', 'Medium', 'Low')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tasks" ON public.tasks FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can create tasks" ON public.tasks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update tasks" ON public.tasks FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete tasks" ON public.tasks FOR DELETE TO public USING (true);

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
