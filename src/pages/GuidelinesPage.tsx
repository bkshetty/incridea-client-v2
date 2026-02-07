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
  EXTERNAL: 350,
};

const championshipData = [
  {
    category: "Gold",
    color: "text-yellow-200",
    winner: 500,
    runnerUp: 450,
    secondRunnerUp: 400,
  },
  {
    category: "Silver",
    color: "text-gray-300",
    winner: 350,
    runnerUp: 300,
    secondRunnerUp: 250,
  },
  {
    category: "Bronze",
    color: "text-orange-400",
    winner: 200,
    runnerUp: 150,
    secondRunnerUp: 100,
  },
];
  EXTERNAL: 250,
}

import SEO from '../components/SEO'

function GuidelinesPage() {
  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10 sm:bg-fixed"
        style={{
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
        }}
      />

      {/* Main Container: Removed pb-safe/pt-safe to let page scroll naturally */}
      <div className="min-h-screen w-full px-3 sm:px-4 lg:px-8 py-8 text-slate-100 font-sans antialiased">
        <div
          /* Removed fixed height 'h-[calc...]' to allow card to grow with content */
          className="mx-auto w-full max-w-6xl flex flex-col relative"
          style={glassCardStyle}
        >
          {/* Removed internal 'overflow-y-auto' so it uses the page scroll */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <header className="space-y-2 sm:space-y-4">
              <h1 className="text-center text-xl sm:text-2xl lg:text-3xl font-normal text-sky-200 leading-tight px-2">
                Guidelines and Regulations for Participating in Incridea 2026
              </h1>

              <p className="text-center text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-4xl mx-auto px-2">
                The fest is open to all students from engineering as well as
                Nitte sister institutions.
              </p>
            </header>

            <div className="text-slate-200 space-y-6 sm:space-y-8">
              <section>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                  Participant Registration, Entry, Identification and Access
                </h2>
                <ul className="list-disc pl-4 sm:pl-6 space-y-2 sm:space-y-3 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base">
                  <li>
                    Registration only through{" "}
                    <a
                      className="underline hover:text-sky-400 text-sky-300 transition-colors font-bold break-all"
                      href={BASE_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {BASE_URL}
                    </a>
                  </li>
                  <li>NMAMIT Students - ₹{REG_AMOUNT_IN_INR.INTERNAL}</li>
                  <li>External Colleges - ₹{REG_AMOUNT_IN_INR.EXTERNAL}</li>
                  <li>Valid PID + College ID + Government ID required</li>
                  <li>On-spot registration available for select events</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                  Event Rules
                </h2>
                <ul className="list-disc pl-4 sm:pl-6 space-y-2 sm:space-y-3 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base">
                  <li>Organisers can modify rules without prior notice</li>
                  <li>Institution not responsible for personal belongings</li>
                  <li>Event-specific rules on respective pages</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                  Championship Points
                </h2>

                <div className="sm:hidden space-y-3 mb-4">
                  {championshipData.map((item) => (
                    <div
                      key={item.category}
                      className="rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <div className={`font-bold mb-2 ${item.color} text-base`}>
                        {item.category}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div>
                          <div className="text-emerald-300 font-bold mb-1">
                            Winner
                          </div>
                          <div className="text-white text-xs">
                            {item.winner}
                          </div>
                        </div>
                        <div>
                          <div className="text-sky-300 font-bold mb-1">
                            Runner-Up
                          </div>
                          <div className="text-white text-xs">
                            {item.runnerUp}
                          </div>
                        </div>
                        <div>
                          <div className="text-amber-300 font-bold mb-1">
                            2nd RU
                          </div>
                          <div className="text-white text-xs">
                            {item.secondRunnerUp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:block my-4 w-full overflow-hidden rounded-lg border border-white/10 bg-black/20">
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left text-xs lg:text-sm">
                      <thead className="border-b border-white/10 bg-white/5 uppercase text-slate-300 font-bold">
                        <tr>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 text-emerald-300">Winner</th>
                          <th className="px-4 py-3 text-sky-300">Runner-Up</th>
                          <th className="px-4 py-3 text-amber-300">
                            2nd Runner-Up
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {championshipData.map((item) => (
                          <tr
                            key={item.category}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className={`px-4 py-3 font-bold ${item.color}`}>
                              {item.category}
                            </td>
                            <td className="px-4 py-3">{item.winner}</td>
                            <td className="px-4 py-3">{item.runnerUp}</td>
                            <td className="px-4 py-3">{item.secondRunnerUp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base mt-3">
                  <li>
                    Min. 3 technical + 2 non-technical finals required for
                    championship
                  </li>
                  <li>Points don't apply to special events</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                  Prohibited Conduct
                </h2>
                <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base">
                  <li>Alcohol, tobacco, drugs strictly prohibited</li>
                  <li>Entry denied if under influence</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                  Accommodation
                </h2>
                <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base">
                  <li>Book via website/form. First-come-first-serve.</li>
                  <li>
                    On-campus: Separate wings, gates close 30min after events,
                    reopen 6AM
                  </li>
                  <li>Off-campus: Details provided, transport available</li>
                </ul>
              </section>

              <section>
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-sky-100 mb-3">
                  Campus Rules
                </h2>
                <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base">
                  <li>Follow all campus regulations</li>
                  <li>Contact organisers/security for assistance</li>
                </ul>
              </section>

              <section className="pt-4 border-t border-white/10">
                <p className="text-slate-300 leading-relaxed text-[10px] sm:text-xs lg:text-sm mb-3">
                  By participating, you agree to these guidelines. Violations
                  may result in expulsion, event cancellation, and penalties.
                  NMAMIT reserves legal rights.
                </p>
                <p className="text-slate-300 leading-relaxed text-[10px] sm:text-xs lg:text-sm">
                  For updates, visit our website and Instagram.
                </p>
              </section>
            </div>
          </div>
    <div className="min-h-screen px-3 sm:px-4 pb-28 md:pb-16 pt-8 sm:pt-10 text-slate-100 md:px-6">
      <SEO title="Guidelines | Incridea'26" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-2xl bg-slate-950/50 border border-slate-800 p-6 md:p-10 shadow-xl">
        <h1 className="text-center text-4xl tracking-wider md:text-6xl font-life-craft text-sky-200">
          Guidelines and Regulations for Participating in Incridea 2026
        </h1>
        <div className="text-slate-200">
          <p className="mt-2 text-center text-slate-300">
            The fest is open to all students from engineering as well as Nitte sister institutions. This article
            outlines the guidelines and regulations that participants need to follow.
          </p>

          <h2 className="my-6 text-2xl font-semibold text-sky-100">Participant Registration, Entry, Identification and Access</h2>
          <ul className="mt-2 list-disc pl-4 space-y-2 text-slate-300">
            <li>
              Registration for the fest can only be done through the official website of Incridea{' '}
              <a className="underline hover:text-sky-400 text-sky-300 transition-colors" href={BASE_URL} target="_blank" rel="noreferrer">
                ({BASE_URL})
              </a>.
            </li>
            <li>
              There are two different categories of participants, who will have access to all the events and pronites.
            </li>
            <li>Students of NMAM Institute of Technology, Nitte - ₹ {REG_AMOUNT_IN_INR.INTERNAL}</li>
            <li>Students of external engineering colleges and Nitte sister institutions - ₹ {REG_AMOUNT_IN_INR.EXTERNAL}</li>
            <li>
              Only students from engineering institutions and Nitte sister institutes are eligible to register.
              Registrations from non-engineering colleges or fraudulent entries will be disqualified without refund.
            </li>
            <li>
              Event registrations can be done either through website or on-spot, which may vary according to the event,
              please check the Incridea website for further information regarding the same.
            </li>
            <li>All participants must present a valid PID (Participant Identification) during registration for events and pronites entry.</li>
            <li>
              The PID provided must belong to the participant registering for the events, and the organisers reserve the right to
              verify its authenticity.
            </li>
            <li>Attendees must present their physical college IDs to access the events and pronites.</li>
            <li>Any participant found to have provided false or misleading information will be disqualified.</li>
            <li>
              Participants are responsible for ensuring the accuracy and validity of their PID and other personal information.
              Failure to provide a valid PID will result in the participant being ineligible to participate in the events and pronites.
            </li>
          </ul>

          <h2 className="my-6 text-2xl font-semibold text-sky-100">Event Rules</h2>
          <ul className="mt-2 list-disc pl-4 space-y-2 text-slate-300">
            <li>
              The organisers of any event hold the right to change the rules of their event prior to its commencement as they see fit,
              without any obligation of notice.
            </li>
            <li>NMAM Institute of Technology &amp; Nitte University is not responsible for any loss or damage to participants&apos; personal belongings.</li>
            <li>Other rules pertaining to the respective events are given in their respective web-pages.</li>
          </ul>

          <h2 className="my-6 text-2xl font-semibold text-sky-100">Prohibited Conduct</h2>
          <ul className="mt-2 list-disc pl-4 space-y-2 text-slate-300">
            <li>The consumption of alcoholic drinks, use of tobacco products, hallucinogenic drugs or other illegal substances on the campus premises is strictly prohibited.</li>
            <li>Anyone trying to enter the campus under the influence of such substances will be denied access.</li>
          </ul>

          <h2 className="my-6 text-2xl font-semibold text-sky-100">Accommodation for external engineering students</h2>
          <ul className="mt-2 list-disc pl-4 space-y-2 text-slate-300">
            <li>The accommodation will be provided for the participants if they have opted for the same in the Incridea website or filled out the Google form provided.</li>
            <li>The accommodation service will be of two types, on-campus and external; the locations of the accommodation will be provided later up on booking of the service.</li>
            <li>Details regarding payment and other relevant information will be provided by the point of contact.</li>
            <li>Allotment will be on a first-come-first-serve basis, of which on-campus will be allotted first.</li>
            <li>
              <p className="font-semibold text-slate-200">The rules and regulations for the on-campus accommodation:</p>
              <ul className="mt-2 list-disc pl-4 space-y-2">
                <li>Separate accommodation for male and female participants.</li>
                <li>The gate of the building in which accommodation is provided will be closed within half an hour from the end of the program every night.</li>
                <li>The gate of the building will only be opened at 6 AM, so it is advised to carry necessary things well in advance.</li>
              </ul>
            </li>
            <li>
              If the accommodation provided is external, then participants will be given details of the place of stay and they may book the same directly; transportation will be provided for the participants from college to place of stay and vice versa.
            </li>
          </ul>

          <h2 className="my-6 text-2xl font-semibold text-sky-100">Campus Rules and Regulations</h2>
          <ul className="mt-2 list-disc pl-4 space-y-2 text-slate-300">
            <li>All the participants when inside the campus, must follow the rules and regulations of the campus.</li>
            <li>If found guilty of any violations, strict actions will be taken.</li>
            <li>Contact concerned organisers, core team, security officials or any other concerned authorities for any help or grievances.</li>
          </ul>

          <p className="mt-6 text-slate-300">
            By participating in Incridea, participants agree to abide by the guidelines and regulations outlined above. Any participant found
            violating the rules may be immediately expelled from the campus, registration for all events may be cancelled, and they will be
            penalized appropriately. NMAM Institute of Technology &amp; Nitte University reserve the right to take any appropriate legal actions
            in any case that requires it.
          </p>

          <p className="mb-4 mt-3 text-slate-300">
            For further information regarding the fest and live updates, check out our website and Instagram handle.
          </p>

          <h2 className="my-6 text-2xl font-semibold text-sky-100">Championship Rules</h2>
          <ul className="mt-2 list-disc pl-4 space-y-2 text-slate-300">
            <li>
              <p className="font-semibold text-slate-200">Events will be classified into 4 categories:</p>
              <div className="my-4 w-full overflow-x-auto rounded-lg border border-slate-700 bg-slate-900/50">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="border-b border-slate-700 bg-slate-800/50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Event Category</th>
                      <th className="px-4 py-3 font-medium text-emerald-300">Winner</th>
                      <th className="px-4 py-3 font-medium text-sky-300">Runner-Up</th>
                      <th className="px-4 py-3 font-medium text-amber-300">Second Runner-Up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-cyan-200">Diamond</td>
                      <td className="px-4 py-3">600</td>
                      <td className="px-4 py-3">550</td>
                      <td className="px-4 py-3">500</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-yellow-200">Gold</td>
                      <td className="px-4 py-3">450</td>
                      <td className="px-4 py-3">400</td>
                      <td className="px-4 py-3">350</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-slate-300">Silver</td>
                      <td className="px-4 py-3">300</td>
                      <td className="px-4 py-3">250</td>
                      <td className="px-4 py-3">200</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-orange-300">Bronze</td>
                      <td className="px-4 py-3">150</td>
                      <td className="px-4 py-3">100</td>
                      <td className="px-4 py-3">50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>To be eligible for the championship, a college must qualify for the final round of at least 3 technical events and 2 non-technical events.</li>
            <li>
              The college that accumulates the highest points will be announced as the winner, and the college with the second-highest points will be declared the runner-up. The second runner-up will not be recognized with a prize; it is included only for calculating the championship points.
            </li>
            <li>The point system does not apply to special events.</li>
          </ul>
        </div>
      </div>

      <svg className="absolute w-0 h-0" aria-hidden="true">
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
