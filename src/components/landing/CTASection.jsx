import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl gradient-hero px-8 py-16 md:px-16 md:py-20 text-center">
          {/* Decorative blurs */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary-400/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white/90">
              <Sparkles className="h-4 w-4 text-accent-400" />
              Start for free, upgrade anytime
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Ready to streamline your rental business?
            </h2>
            <p className="text-lg text-white/70">
              Join thousands of businesses that trust RentFlow to manage their rental operations efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="xl"
                  className="bg-white text-primary-700 hover:bg-white/90 shadow-xl w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CTASection };
