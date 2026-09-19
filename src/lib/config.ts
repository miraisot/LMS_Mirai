function read(name: string, fallback: string) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : fallback;
}

export const site = {
  name: read("NEXT_PUBLIC_LMS_NAME", "Mirai School of Technology"),
  tagline: read(
    "NEXT_PUBLIC_LMS_TAGLINE",
    "An AI-first B.Tech experience — how-tos, labs, and assignments from Day 1.",
  ),
  institution: read("NEXT_PUBLIC_INSTITUTION", "Mirai School of Technology"),
  studentName: read("NEXT_PUBLIC_STUDENT_NAME", "Student"),
  logoUrl: read("NEXT_PUBLIC_LMS_LOGO", "/mirai-logo.svg"),
};
