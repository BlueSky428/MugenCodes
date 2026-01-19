import type { Metadata } from "next";
import Image from "next/image";

import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Team"
};

type TeamMember = {
  name: string;
  role: string;
  photoSrc: string;
  age: string;
  location: string;
  majorSkills: string;
  bio: string;
  strengths: string;
  value: string;
};

const teamMembers: TeamMember[] = [
  {
    name: "Jayabrata Bhaduri",
    role: "Project Manager",
    photoSrc: "/team/jayabrata.png",
    age: "41 years old",
    location: "New Delhi, India",
    majorSkills:
      "Major skill is client communication and project coordination.",
    bio:
      "Jayabrata is an Indian project manager with deep client care and a wide partner network. He keeps goals clear and builds trust through calm updates.",
    strengths:
      "He turns complex ideas into clear written plans and keeps decisions moving without pressure.",
    value:
      "Clients get a steady point of contact and a clear view of progress at all times."
  },
  {
    name: "Ren Takahashi",
    role: "Lead Developer",
    photoSrc: "/team/ren.png",
    age: "31 years old",
    location: "Tokyo, Japan",
    majorSkills: "Major skill is system architecture and technical planning.",
    bio:
      "Ren is a Japanese senior developer who leads architecture, meaning the structure of the system. He sets the technical plan and reviews quality before delivery.",
    strengths:
      "He breaks work into safe steps and checks that the system stays stable and easy to change.",
    value:
      "Clients get reliable delivery and fewer surprises because planning and review are owned."
  },
  {
    name: "Takahiro Sato",
    role: "Senior Developer",
    photoSrc: "/team/takahiro.svg",
    age: "31 years old",
    location: "Tokyo, Japan",
    majorSkills:
      "Major skill is code quality and documentation.",
    bio:
      "Takahiro is a Japanese senior developer who focuses on careful implementation and clean handover. He owns his tasks and documents what he ships.",
    strengths:
      "He writes clear code and tests his work so the system stays stable under change.",
    value:
      "Clients get dependable features and easy future maintenance."
  },
  {
    name: "Kenji Nakamura",
    role: "Senior Developer",
    photoSrc: "/team/kenji.svg",
    age: "31 years old",
    location: "Tokyo, Japan",
    majorSkills:
      "Major skill is problem solving and reliable delivery.",
    bio:
      "Kenji is a Japanese senior developer with a calm problem solving style. He takes ownership of his deliverables and keeps quality high.",
    strengths:
      "He balances speed with care so delivery stays steady without cutting corners.",
    value:
      "Clients get steady progress and a result that feels solid on launch day."
  }
];

export default function TeamPage() {
  return (
    <>
      <Section title="A calm team with clear roles">
        <p>
          We are a small team by design. Each role is clear and owned, so work
          moves with less risk and fewer surprises.
        </p>
      </Section>

      <Section title="Meet the team">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-ink/10 bg-white p-8 shadow-card transition hover:shadow-soft dark:border-white/10 dark:bg-nightSoft"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative h-48 w-48 overflow-hidden rounded-3xl border-2 border-ink/10 bg-surface shadow-md dark:border-white/10 dark:bg-night md:h-56 md:w-56 lg:h-64 lg:w-64">
                  <Image
                    src={member.photoSrc}
                    alt={`${member.name} portrait`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  />
                </div>
                <div className="mt-6 w-full">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/50 dark:text-white/50">
                    {member.role}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-ink dark:text-white md:text-3xl">
                    {member.name}
                  </h3>
                </div>
              </div>
              <div className="mt-6 space-y-2.5 text-sm text-ink/65 dark:text-white/60">
                <p className="font-medium">{member.age}</p>
                <p>{member.location}</p>
                <p className="pt-1 text-ink/75 dark:text-white/75">{member.majorSkills}</p>
              </div>
              <div className="mt-6 space-y-4 border-t border-ink/10 pt-6 text-sm leading-relaxed dark:border-white/10">
                <p className="text-ink/70 dark:text-white/70">{member.bio}</p>
                <p className="text-ink/70 dark:text-white/70">
                  {member.strengths}
                </p>
                <p className="text-ink/70 dark:text-white/70">{member.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Who you talk to and how decisions move">
        <p>
          You always talk with the project manager. He listens, confirms goals
          in writing, and keeps progress clear.
        </p>
        <p>
          The lead developer turns your goals into a safe plan and reviews every
          delivery. The senior developers own the tasks assigned to them and
          deliver with care.
        </p>
      </Section>
    </>
  );
}
