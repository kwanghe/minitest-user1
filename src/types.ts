export interface Survey {
  survey_id: number;
  title: string;
  description: string;
}

export interface Question {
  question_id: number;
  question_text: string;
  question_type: string;
  question_number: number;
  shuffle_options: boolean;
  created_at: string;
  options: Option[];
}

export interface Option {
  option_text: string;
  option_image_path: string | null;
  option_order: number;
  weights: string;
}