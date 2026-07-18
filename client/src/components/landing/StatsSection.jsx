import { useEffect, useRef, useState } from "react";
import { Package, Users, TrendingUp, Clock } from "lucide-react";

const stats = [
  { icon: Package, label: "Products Listed", target: 10000, suffix: "+" },
  { icon: Users, label: "Happy Customers", target: 5000, suffix: "+" },
  { icon: TrendingUp, label: "Rentals Completed", target: 25000, suffix: "+" },
  { icon: Clock, label: "Uptime", target: 99, suffix: "%" },
];

function AnimatedCounter({ target, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, inView]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatsSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 gradient-primary text-white"
    >
      <div className="container-app">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl md:text-4xl font-black mb-1">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { StatsSection };
