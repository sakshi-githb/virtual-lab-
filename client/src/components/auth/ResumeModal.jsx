import React from 'react';
import { X, Download, Mail, Globe, Briefcase, GraduationCap, Cloud, ExternalLink } from 'lucide-react';

const ResumeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-charcoal/80 flex items-center justify-center z-50 p-4 font-sans overflow-y-auto">
      {/* Neo-Brutalist Resume Window */}
      <div className="w-full max-w-4xl bg-cream border-4 border-charcoal shadow-brutal-xl relative flex flex-col max-h-[90vh]">
        
        {/* Header Block */}
        <div className="bg-brutalYellow border-b-4 border-charcoal p-4 sm:p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white border-3 border-charcoal p-2 shadow-brutal-sm">
              <Cloud className="w-6 h-6 text-charcoal" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-tight">Developer Profile & CV</h3>
              <p className="text-xs font-bold text-charcoal/70">AWS Cloud & Full-Stack Developer</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border-3 border-charcoal bg-white shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
          >
            <X className="w-5 h-5 text-charcoal" />
          </button>
        </div>

        {/* CV Body Container (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 select-text">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LEFT PROFILE PANEL */}
            <div className="md:col-span-1 flex flex-col gap-5">
              {/* Personal Card */}
              <div className="bg-white border-3 border-charcoal p-4 shadow-brutal-sm">
                <h4 className="font-black text-2xl uppercase leading-tight">Sakshi Dalvi</h4>
                <p className="text-xs font-mono font-bold text-charcoal/60 mt-1 uppercase tracking-wider">Cloud Engineer In Training</p>
                <div className="border-t-2 border-charcoal/20 my-3 pt-3 flex flex-col gap-2.5 text-xs font-semibold">
                  <a href="mailto:sakshi.githb@gmail.com" className="flex items-center gap-2 hover:text-brutalBlue transition-colors">
                    <Mail className="w-4 h-4 text-brutalBlue shrink-0" />
                    <span className="truncate">sakshi.githb@gmail.com</span>
                  </a>
                  <a href="https://github.com/sakshi-githb" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-brutalBlue transition-colors">
                    <Globe className="w-4 h-4 text-charcoal shrink-0" />
                    <span>github.com/sakshi-githb</span>
                  </a>
                </div>
              </div>

              {/* Skills Matrix */}
              <div className="bg-white border-3 border-charcoal p-4 shadow-brutal-sm flex-1">
                <h5 className="font-black text-sm uppercase tracking-wider border-b-2 border-charcoal pb-1.5 mb-3 flex items-center gap-2">
                  <Cloud className="w-4 h-4" /> Technical Skills
                </h5>
                <div className="flex flex-col gap-4 text-xs font-bold">
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/50 block mb-1">Cloud Platforms</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['AWS S3', 'AWS EC2', 'AWS IAM', 'AWS CLI', 'AWS VPC'].map(s => (
                        <span key={s} className="bg-brutalYellow/20 border-2 border-charcoal px-2 py-0.5 text-[10px]">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/50 block mb-1">Frontend Engineering</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['React.js', 'Vite', 'Tailwind CSS', 'HTML5/CSS3', 'Matter.js'].map(s => (
                        <span key={s} className="bg-brutalBlue/10 border-2 border-charcoal px-2 py-0.5 text-[10px]">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/50 block mb-1">Backend & Data</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Node.js', 'Express.js', 'Socket.io', 'MongoDB', 'REST APIs'].map(s => (
                        <span key={s} className="bg-brutalGreen/10 border-2 border-charcoal px-2 py-0.5 text-[10px]">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT EXP & EDUCATION PANEL */}
            <div className="md:col-span-2 flex flex-col gap-6">
              
              {/* Education section */}
              <div className="bg-white border-3 border-charcoal p-5 shadow-brutal-sm">
                <h5 className="font-black text-base uppercase tracking-wider border-b-2 border-charcoal pb-1.5 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brutalBlue" /> Education
                </h5>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <h6 className="font-extrabold text-sm uppercase">Post Graduate Diploma in Advanced Computing (PG-DAC)</h6>
                      <span className="bg-charcoal text-white text-[9px] font-mono font-bold px-2 py-0.5 uppercase">March 2026 – Sept 2026</span>
                    </div>
                    <p className="text-xs font-bold text-brutalBlue mt-0.5">CDAC Kolkata (Centre for Development of Advanced Computing)</p>
                    <p className="text-[11px] text-charcoal/60 mt-1 font-semibold">Specialized training in Advanced Software Engineering, Cloud Computing, Full-Stack MERN Deployment, Database Management, and Systems Programming.</p>
                  </div>
                  <div className="border-t-2 border-dashed border-charcoal/10 pt-3">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <h6 className="font-extrabold text-sm uppercase">Bachelor of Technology (Computer Science & Engineering)</h6>
                      <span className="bg-charcoal/20 text-charcoal text-[9px] font-mono font-bold px-2 py-0.5 uppercase">2021 – 2025</span>
                    </div>
                    <p className="text-xs font-bold text-charcoal/70 mt-0.5">B.Tech University Graduate</p>
                  </div>
                </div>
              </div>

              {/* Projects section */}
              <div className="bg-white border-3 border-charcoal p-5 shadow-brutal-sm">
                <h5 className="font-black text-base uppercase tracking-wider border-b-2 border-charcoal pb-1.5 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brutalGreen" /> Projects & Experience
                </h5>
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <h6 className="font-black text-sm uppercase flex items-center gap-1.5">
                        VIRTUAL-LAB: Collaborative Physics Digital Twin 
                        <a href="https://virtualabsakshi.netlify.app/" target="_blank" rel="noreferrer" className="text-brutalBlue hover:text-blue-700">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </h6>
                      <span className="text-[10px] font-mono font-bold text-charcoal/50">React • Socket.io • Express • MongoDB</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-2 text-xs font-semibold text-charcoal/80 flex flex-col gap-1">
                      <li>Designed a high-performance 2D physics sandbox using React-to-Matter.js engine bridge inside React refs running at 60 FPS.</li>
                      <li>Implemented a multiplayer classroom lobby syncing body dynamics (coordinates, velocity, angle) at 30Hz with client-side linear interpolation.</li>
                      <li>Integrated a live AI Physics Professor powered by Google Gemini API to explain collision kinematics.</li>
                    </ul>
                  </div>

                  <div className="border-t-2 border-dashed border-charcoal/10 pt-4">
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <h6 className="font-black text-sm uppercase">AWS Cloud Static Website Deployment</h6>
                      <span className="text-[10px] font-mono font-bold text-charcoal/50">AWS S3 • EC2 • IAM • CLI</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-2 text-xs font-semibold text-charcoal/80 flex flex-col gap-1">
                      <li>Deployed static client assets onto an AWS S3 bucket configured for Static Website Hosting and public-read access policies.</li>
                      <li>Configured robust cloud security parameters, including dedicated IAM users, administrative policies, and Multi-Factor Authentication (MFA).</li>
                      <li>Automated deployment sync and directory updates using the AWS CLI, verifying operations with script outputs.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-cream border-t-4 border-charcoal p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <span className="text-xs font-mono font-bold text-charcoal/50 text-center sm:text-left">
            CDAC Kolkata Cloud Computing Certification Project
          </span>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial border-3 border-charcoal bg-white font-bold text-xs uppercase px-4 py-2 shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer text-center"
            >
              Print CV
            </button>
            <a
              href="/resume.pdf"
              download="Sakshi_Dalvi_Resume.pdf"
              className="flex-1 sm:flex-initial btn-brutal-yellow font-black text-xs uppercase px-5 py-2 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Download CV (PDF)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeModal;
