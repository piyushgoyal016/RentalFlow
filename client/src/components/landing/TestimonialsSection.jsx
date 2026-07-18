import { testimonials } from "@/data/mockData";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
            Trusted by businesses everywhere
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            See what our customers have to say about RentFlow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <Quote className="h-8 w-8 text-primary-100 mb-4" />
              <p className="text-slate-600 leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { TestimonialsSection };
