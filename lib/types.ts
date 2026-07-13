export type QuestionType = "career" | "wealth" | "child_potential" | "relationship";
export type ReportPoint = { heading: string; body: string; basis?: { factor: string; value: string } };
export type ChartData = { hour: string | null; day: string; month: string; year: string; day_master: string; strength?: string; day_master_strength?: "Strong" | "Weak"; structure?: string; profile_stars?: string[] };
export type SummaryReport = { personality: string; strengths: ReportPoint[]; soft_spots: ReportPoint[]; concern_response?: string; parenting_tips: ReportPoint[]; closing_encouragement: string };
export type BaziReport = {
  id: string; subject_name: string; birth_date: string; birth_time: string | null;
  birth_place: string | null; parenting_concern: string | null;
  gender: string | null; question_type: QuestionType; email: string;
  day_pillar: string | null; month_pillar: string | null; year_pillar: string | null;
  hour_pillar: string | null; element_profile: string | null; insights: string | null;
  insights_source: string | null; insights_confidence: number | null;
  insights_review_status: string; is_premium: boolean; is_demo: boolean; created_at: string;
  chart_status: "pending" | "verified" | "unavailable"; chart_data: ChartData | null;
  report_content: SummaryReport | null; generation_error: string | null;
};
