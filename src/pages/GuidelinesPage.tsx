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
  (typeof window !== "undefined" ? window.location.origin : "")

const REG_AMOUNT_IN_INR = {
  INTERNAL: 250,
  EXTERNAL: 350,
}

function GuidelinesPage() {
  return (
    <>
      <div 
        className="fixed inset-0 bg-cover bg-center bg-fixed bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${galaxyBg})` }}
      />
      <div className="min-h-screen px-3 sm:px-4 pb-28 md:pb-16 pt-8 sm:pt-10 text-slate-100 md:px-6 font-['mocoSans']">
        <div 
          className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 md:p-10 relative max-h-[85vh]"
          style={glassCardStyle}
        >
          {/* Scrollable Content Container */}
          <div className="overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            <h1 className="text-center text-3xl tracking-wider md:text-5xl font-normal text-sky-200">
              Guidelines and Regulations for Participating in Incridea 2024
            </h1>

            <p className="text-center text-slate-300 text-lg leading-relaxed">
              The fest is open to all students from engineering as well as Nitte sister institutions. This article outlines the guidelines and regulations that participants need to follow.
            </p>

            <div className="text-slate-200 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-sky-100 mb-4">
                  Participant Registration, Entry, Identification and Access
                </h2>
                <ul className="list-disc pl-4 space-y-3 text-slate-300 leading-relaxed">
                  <li>
                    Registration for the fest can only be done through the official website of Incridea{" "}
                    <a
                      className="underline hover:text-sky-400 text-sky-300 transition-colors font-bold"
                      href={BASE_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ({BASE_URL})
                    </a>.
                  </li>
                  <li>There are two different categories of participants, who will have access to all the events and pronites.</li>
                  <li>Students of NMAM Institute of Technology, Nitte - ₹{REG_AMOUNT_IN_INR.INTERNAL}</li>
                  <li>Students of external engineering colleges and Nitte sister institutions - ₹{REG_AMOUNT_IN_INR.EXTERNAL}</li>
                  <li>Event registrations can be done either through website or on-spot, which may vary according to the event, please check the Incridea website for further information regarding the same.</li>
                  <li>All participants must present a valid PID (Participant Identification) during registration for events and pronites entry.</li>
                  <li>The PID provided must belong to the participant registering for the events, and the organisers reserve the right to verify its authenticity.</li>
                  <li>Attendees must present their physical college IDs along with a valid government-issued ID proof (Aadhaar, driver's license, Voter ID, etc.) to access the events and pronites.</li>
                  <li>Any participant found to have provided false or misleading information will be disqualified.</li>
                  <li>Participants are responsible for ensuring the accuracy and validity of their PID and other personal information. Failure to provide a valid PID will result in the participant being ineligible to participate in the events and pronites.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-sky-100 mb-4">Event Rules</h2>
                <ul className="list-disc pl-4 space-y-3 text-slate-300 leading-relaxed">
                  <li>The organisers of any event hold the right to change the rules of their event prior to its commencement as they see fit, without any obligation of notice.</li>
                  <li>NMAM Institute of Technology & Nitte University is not responsible for any loss or damage to participants' personal belongings.</li>
                  <li>Other rules pertaining to the respective events are given in their respective web-pages.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-sky-100 mb-4">Championship Rules</h2>
                <p className="font-bold text-slate-200 mb-4">Events will be classified into 3 categories:</p>
                
                <div className="my-4 w-full overflow-x-auto rounded-lg border border-white/10 bg-black/20">
                  <table className="w-full min-w-[600px] text-left">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-300 font-bold">
                      <tr>
                        <th className="px-4 py-3">Event Category</th>
                        <th className="px-4 py-3 text-emerald-300">Winner</th>
                        <th className="px-4 py-3 text-sky-300">Runner-Up</th>
                        <th className="px-4 py-3 text-amber-300">Second Runner-Up</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-bold text-yellow-200">Gold</td>
                        <td className="px-4 py-3">500</td>
                        <td className="px-4 py-3">450</td>
                        <td className="px-4 py-3">400</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-300">Silver</td>
                        <td className="px-4 py-3">350</td>
                        <td className="px-4 py-3">300</td>
                        <td className="px-4 py-3">250</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-bold text-orange-700">Bronze</td>
                        <td className="px-4 py-3">200</td>
                        <td className="px-4 py-3">150</td>
                        <td className="px-4 py-3">100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <ul className="list-disc pl-4 space-y-3 text-slate-300 leading-relaxed mt-4">
                  <li>College must enter the final round of at least 3 technical events and 2 non-technical events to be eligible for championship.</li>
                  <li>The college which has accumulated the highest points will be announced as winners and the college which is next to it as runner-up. Second runner-up will not be recognized with a prize, it is only assigned for the calculation of the championship.</li>
                  <li>The point system does not apply to special events.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-sky-100 mb-4">Prohibited Conduct</h2>
                <ul className="list-disc pl-4 space-y-3 text-slate-300 leading-relaxed">
                  <li>The consumption of alcoholic drinks, use of tobacco products, hallucinogenic drugs or other illegal substances on the campus premises is strictly prohibited.</li>
                  <li>Anyone trying to enter the campus under the influence of such substances will be denied access.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-sky-100 mb-4">Accommodation for external engineering students</h2>
                <ul className="list-disc pl-4 space-y-3 text-slate-300 leading-relaxed">
                  <li>The accommodation will be provided for the participants if they have opted for the same in the Incridea website or filled out the Google form provided.</li>
                  <li>The accommodation service will be of two types, on-campus and external; the locations of the accommodation will be provided later up on booking of the service.</li>
                  <li>Details regarding payment and other relevant information will be provided by the point of contact.</li>
                  <li>Allotment will be on a first-come-first-serve basis, of which on-campus will be allotted first.</li>
                  <li>
                    <p className="font-bold text-slate-100 mb-2">The rules and regulations for the on-campus accommodation:</p>
                    <ul className="list-disc pl-4 space-y-2 text-slate-300">
                      <li>Separate accommodation for male and female participants.</li>
                      <li>The gate of the building in which accommodation is provided will be closed within half an hour from the end of the program every night.</li>
                      <li>The gate of the building will only be opened at 6 AM, so it is advised to carry necessary things well in advance.</li>
                    </ul>
                  </li>
                  <li>If the accommodation provided is external, then participants will be given details of the place of stay and they may book the same directly; transportation will be provided for the participants from college to place of stay and vice versa.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-sky-100 mb-4">Campus Rules and Regulations</h2>
                <ul className="list-disc pl-4 space-y-3 text-slate-300 leading-relaxed">
                  <li>All the participants when inside the campus, must follow the rules and regulations of the campus.</li>
                  <li>Contact concerned organisers, core team, security officials or any other concerned authorities for any help or grievances.</li>
                </ul>
              </section>

              <section className="pt-4 border-t border-white/10">
                <p className="text-slate-300 leading-relaxed mb-3">
                  By participating in Incridea, participants agree to abide by the guidelines and regulations outlined above. Any participant found violating the rules may be immediately expelled from the campus, registration for all events may be cancelled, and they will be penalized appropriately. NMAM Institute of Technology & Nitte University reserve the right to take any appropriate legal actions in any case that requires it.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  For further information regarding the fest and live updates, check out our website and Instagram handle.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style>{`
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
      </div>

      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="displacementFilter">
            <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="2" result="turbulence" />
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </>
  );
}

export default GuidelinesPage;