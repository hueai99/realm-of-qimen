export type QuestionType = "career" | "wealth" | "child_potential" | "relationship";
export type BaziReport = {
  id: string; subject_name: string; birth_date: string; birth_time: string | null;
  gender: string | null; question_type: QuestionType; email: string;
  day_pillar: string | null; month_pillar: string | null; year_pillar: string | null;
  hour_pillar: string | null; element_profile: string | null; insights: string | null;
  insights_source: string | null; insights_confidence: number | null;
  insights_review_status: string; is_premium: boolean; is_demo: boolean; created_at: string;
};
