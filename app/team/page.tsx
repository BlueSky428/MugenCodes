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
      "Specializes in client communication and project coordination.",
    bio:
      "Jayabrata is a project manager based in India with extensive client relationship management experience and a broad partner network. He maintains clear project objectives and builds trust through transparent, regular communication.",
    strengths:
      "He translates complex requirements into comprehensive written plans and facilitates decision-making processes efficiently.",
    value:
      "Clients benefit from a dedicated point of contact and comprehensive visibility into project progress at all stages."
  },
  {
    name: "Ren Takahashi",
    role: "Lead Developer",
    photoSrc: "/team/ren.png",
    age: "31 years old",
    location: "Tokyo, Japan",
    majorSkills: "Specializes in system architecture and technical planning.",
    bio:
      "Ren is a senior developer based in Japan who leads system architecture design. He establishes technical specifications and conducts quality assurance reviews prior to delivery.",
    strengths:
      "He decomposes complex work into manageable phases and ensures system stability and maintainability.",
    value:
      "Clients receive reliable deliverables with minimal surprises due to comprehensive planning and thorough review processes."
  },
  {
    name: "Takahiro Sato",
    role: "Senior Developer",
    photoSrc: "/team/takahiro.png",
    age: "31 years old",
    location: "Tokyo, Japan",
    majorSkills:
      "Specializes in code quality and technical documentation.",
    bio:
      "Takahiro is a senior developer based in Japan who focuses on meticulous implementation and comprehensive handover documentation. He takes full ownership of assigned tasks and maintains detailed documentation for all deliverables.",
    strengths:
      "He produces well-structured, maintainable code and implements thorough testing to ensure system stability during future modifications.",
    value:
      "Clients receive dependable features with comprehensive documentation that facilitates future maintenance and enhancements."
  },
  {
    name: "Kenji Nakamura",
    role: "Senior Developer",
    photoSrc: "/team/kenji.png",
    age: "31 years old",
    location: "Tokyo, Japan",
    majorSkills:
      "Specializes in problem solving and reliable delivery.",
    bio:
      "Kenji is a senior developer based in Japan with a methodical approach to problem solving. He takes full ownership of his deliverables and maintains high quality standards.",
    strengths:
      "He balances efficiency with thoroughness to ensure consistent delivery without compromising quality.",
    value:
      "Clients receive consistent progress updates and a robust, production-ready solution upon launch."
  }
];

export default function TeamPage() {
  return (
    <>
      <Section title="A focused team with clearly defined roles">
        <div className="max-w-3xl">
        <p>
            We maintain a small, dedicated team by design. Each role has clearly defined responsibilities and ownership, enabling efficient execution with reduced risk and greater predictability.
        </p>
        </div>
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
              <div className="mt-6 space-y-4 border-t border-ink/10 pt-6 text-base leading-relaxed dark:border-white/10">
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
    </>
  );
}
