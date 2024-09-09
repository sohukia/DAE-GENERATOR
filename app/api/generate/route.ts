import { NextRequest, NextResponse } from 'next/server';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

interface Course {
  course_code: string;
  natural_name: string;
  time: string;
  evaluation: boolean;
}

interface FormData {
  full_name: string;
  promo_year: number;
  apprenticeship: boolean;
  major: string;
  td_group: string;
  absence_day: string;
  courses: Course[];
  reason: string;
}

function createListOfCourseAsASingleString(courses: Course[]): string {
  return courses.map(course => `${course.course_code} - ${course.natural_name} ${course.time}. Evaluation : ${course.evaluation ? "Oui" : "Non"}.`).join('\n\t');
}

export async function POST(req: NextRequest) {
  const data: FormData = await req.json();

  // Load template
  const templatePath = path.join(process.cwd(), 'public', 'template.docx');
  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);

  const doc = new Docxtemplater()
    .loadZip(zip)
    .setData({
      current_date: new Date().toLocaleDateString(),
      full_name: data.full_name.trim(),
      promo_year: data.promo_year,
      apprenticeship: data.apprenticeship ? 'APP' : '',
      major: data.major.trim(),
      td_group: data.td_group.trim(),
      absence_day: data.absence_day.trim(),
      courses: createListOfCourseAsASingleString(data.courses),
      reason: data.reason.trim(),
    });

  try {
    doc.render();
  } catch (error) {
    return NextResponse.json({ error: 'Document rendering failed' }, { status: 500 });
  }

  const buffer = doc.getZip().generate({ type: 'nodebuffer' });
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename=${data.full_name}_document.docx`,
    },
  });
}