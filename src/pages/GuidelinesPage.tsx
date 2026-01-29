import galaxyBg from '../assets/galaxy-bg.jpg';

const glassCardStyle = {
  borderRadius: "1.75rem",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  background: `
    linear-gradient(to top, rgba(0, 0, 0, 0.20), transparent 60%),
    rgba(21, 21, 21, 0.30)
  `,
  boxShadow: `
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.22)
  `,
  backdropFilter: "brightness(1.1) blur(1px)",
  WebkitBackdropFilter: "brightness(1.1) blur(1px)",
};

const BASE_URL: string =
  (import.meta.env.VITE_BASE_URL as string | undefined) ??
  (typeof window !== "undefined" ? window.location.origin : "");

const REG_AMOUNT_IN_INR = {
  INTERNAL: 250,
  EXTERNAL: 250,
};

function GuidelinesPage() {
  return (
    <>
    <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${galaxyBg})` }}
      />
      <div className="min-h-screen px-3 sm:px-4 pb-28 md:pb-16 pt-8 sm:pt-10 text-slate-100 md:px-6 font-['mocoSans'] ">
        <div 
  className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 md:p-10 relative"
  style={glassCardStyle}
>
          {/* Main Title - Black (900) */}
          <h1 className="text-center text-3xl tracking-wider md:text-5xl font-normal text-sky-200">
            Guidelines and Regulations for Participating in Incridea 2026
          </h1>

          <div className="text-slate-200">
            <p className="mt-2 text-center text-slate-300 text-lg leading-relaxed">
              The fest is open to all students from engineering as well as Nitte
              sister institutions. This article outlines the guidelines and
              regulations that participants need to follow.
            </p>

            {/* Section Headings - Bold (700) */}
            <h2 className="my-6 text-2xl font-bold text-sky-100">
              Participant Registration, Entry, Identification and Access
            </h2>
            <ul className="mt-2 list-disc pl-4 space-y-3 text-slate-300 leading-relaxed">
              <li>
                Registration for the fest can only be done through the official
                website of Incridea{" "}
                <a
                  className="underline hover:text-sky-400 text-sky-300 transition-colors font-bold"
                  href={BASE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  ({BASE_URL})
                </a>
                .
              </li>
              <li>
                There are two different categories of participants, who will
                have access to all the events and pronites.
              </li>
              <li>
                Students of NMAM Institute of Technology, Nitte - {" "}
                <span className="font-bold text-sky-200">₹{REG_AMOUNT_IN_INR.INTERNAL}</span>
              </li>
              <li>
                Students of external engineering colleges and Nitte sister
                institutions - {" "}
                <span className="font-bold text-sky-200">₹{REG_AMOUNT_IN_INR.EXTERNAL}</span>
              </li>
              <li>
                Only students from engineering institutions and Nitte sister
                institutes are eligible to register. Registrations from
                non-engineering colleges or fraudulent entries will be
                disqualified without refund.
              </li>
              <li>
                Event registrations can be done either through website or
                on-spot, which may vary according to the event.
              </li>
              <li>
                All participants must present a valid PID (Participant
                Identification) during registration.
              </li>
              <li>
                Attendees must present their physical college IDs to access the
                events and pronites.
              </li>
            </ul>

            <h2 className="my-6 text-2xl font-bold text-sky-100">
              Event Rules
            </h2>
            <ul className="mt-2 list-disc pl-4 space-y-3 text-slate-300 leading-relaxed">
              <li>
                The organisers reserve the right to change event rules prior to
                commencement.
              </li>
              <li>
                NMAMIT & Nitte University are not responsible for loss or damage
                to personal belongings.
              </li>
            </ul>

            <h2 className="my-6 text-2xl font-bold text-sky-100">
              Prohibited Conduct
            </h2>
            <ul className="mt-2 list-disc pl-4 space-y-3 text-slate-300 leading-relaxed">
              <li>
                Consumption of alcohol, tobacco, or illegal substances on campus
                is strictly prohibited.
              </li>
              <li>Entry under the influence will result in denied access.</li>
            </ul>

            <h2 className="my-6 text-2xl font-bold text-sky-100">
              Championship Rules
            </h2>
            <p className="font-bold text-slate-200 mb-4 text-lg">
              Events will be classified into 4 categories:
            </p>
            <div className="my-4 w-full overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/50">
              <table className="w-full min-w-[600px] text-left">
                <thead className="border-b border-slate-700 bg-slate-800/50 text-xs uppercase text-slate-400 font-bold">
                  <tr>
                    <th className="px-4 py-3">Event Category</th>
                    <th className="px-4 py-3 text-emerald-300">Winner</th>
                    <th className="px-4 py-3 text-sky-300">Runner-Up</th>
                    <th className="px-4 py-3 text-amber-300">Second Runner-Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-cyan-200">
                      Diamond
                    </td>
                    <td className="px-4 py-3">600</td>
                    <td className="px-4 py-3">550</td>
                    <td className="px-4 py-3">500</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-yellow-200">
                      Gold
                    </td>
                    <td className="px-4 py-3">450</td>
                    <td className="px-4 py-3">400</td>
                    <td className="px-4 py-3">350</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Background/Overlay Elements */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="displacementFilter">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.01"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in2="turbulence"
              in="SourceGraphic"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      
    </>
  );
}

export default GuidelinesPage;