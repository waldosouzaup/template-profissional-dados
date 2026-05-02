import { useJourneyList } from "@/hooks/useJourney";
import { Milestone, Circle } from "lucide-react";

export default function JourneySection() {
  const { data: journeyItems = [], isLoading } = useJourneyList();

  if (isLoading || journeyItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-20 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Milestone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground/30 mb-1">
            Timeline
          </p>
          <h2 className="text-2xl font-light text-foreground">Minha Jornada</h2>
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-12 before:absolute before:inset-0 before:ml-[1.7rem] sm:before:ml-[2.2rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {journeyItems.map((item, index) => (
          <div 
            key={item.id} 
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            style={{ animationDelay: `${index * 100}ms`, animation: 'fadeInUp 0.5s ease-out both' }}
          >
            {/* Timeline Dot */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#0a0a0a] bg-primary/20 text-primary absolute left-0 md:left-1/2 -translate-x-2.5 sm:-translate-x-3.5 md:-translate-x-1/2 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-transform duration-300 group-hover:scale-125 z-10">
              <Circle className="w-2.5 h-2.5 fill-primary" />
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] glass-panel p-6 rounded-2xl hover:bg-foreground/[0.03] transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.05)]">
              <div className="flex flex-col gap-2">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase rounded-full w-fit">
                  {item.year}
                </span>
                <h3 className="text-xl font-medium text-foreground/90 leading-tight">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-foreground/50 leading-relaxed mt-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
