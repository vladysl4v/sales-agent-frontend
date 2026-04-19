"use client";

import { Mail } from "lucide-react";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
}

const LEADS: Lead[] = [
  { id: "1", name: "Markus Brandt",  role: "Managing Director",   company: "Reifen Brandt GmbH" },
  { id: "2", name: "Sandra Koch",    role: "Workplace Safety",     company: "ATU Auto-Teile-Unger" },
  { id: "3", name: "Peter Hoffmann", role: "Branch Manager",       company: "Vergölst GmbH" },
  { id: "4", name: "Julia Mayer",    role: "HSE Officer",          company: "Euromaster GmbH" },
  { id: "5", name: "Stefan Wolf",    role: "Operations Manager",   company: "Reifen Wolf KG" },
  { id: "6", name: "Klaus Fischer",  role: "Safety Officer",       company: "Point S Deutschland" },
  { id: "7", name: "Monika Schulz",  role: "Managing Director",   company: "Reifendiscount24 GmbH" },
  { id: "8", name: "Andreas Braun",  role: "Workshop Manager",     company: "Reifen Braun & Söhne" },
];

const AVATAR_COLORS = [
  "#0052CC", "#00875A", "#6554C0", "#FF8B00",
  "#DE350B", "#00B8D9", "#36B37E", "#8777D9",
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function LeadList() {
  return (
    <div>
      <div className="sticky top-0 z-10 h-14 bg-white border-b border-[#DFE1E6] px-8 flex items-center shrink-0">
        <h1 className="text-[20px] font-semibold text-[#172B4D]">Lead List</h1>
      </div>

      <div className="px-8 py-6">
        <div className="bg-white border border-[#DFE1E6] rounded-[3px] shadow-[0_1px_1px_rgba(9,30,66,0.1)] divide-y divide-[#DFE1E6]">
          {LEADS.map((lead, idx) => (
            <div key={lead.id} className="flex items-center gap-2 px-4 py-3 hover:bg-[#F4F5F7] transition-colors">
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
              >
                {initials(lead.name)}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-[18px] font-semibold text-[#172B4D] truncate">{lead.name}</p>
                <p className="text-[12px] text-[#6B778C] truncate">{lead.role} · {lead.company}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                <a
                  href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(lead.name + " " + lead.company)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] text-[12px] font-medium text-[#6B778C] border border-[#DFE1E6] bg-white hover:border-[#0052CC] hover:text-[#0052CC] transition-colors"
                >
                  <LinkedInIcon />
                  LinkedIn Activity
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent("velth – Safety Documentation for " + lead.company)}`}
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] text-[12px] font-medium text-[#6B778C] border border-[#DFE1E6] bg-white hover:border-[#0052CC] hover:text-[#0052CC] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Mail Activity
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
