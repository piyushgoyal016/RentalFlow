import { Link } from "react-router-dom";
import { categories } from "@/data/mockData";
import { Laptop, Armchair, Car, Wrench, PartyPopper, Dumbbell } from "lucide-react";
import { ArrowRight } from "lucide-react";

const iconMap = {
  Laptop,
  Armchair,
  Car,
  Wrench,
  PartyPopper,
  Dumbbell,
};

const colorMap = {
  "cat-1": "from-blue-500 to-indigo-600",
  "cat-2": "from-amber-500 to-orange-600",
  "cat-3": "from-emerald-500 to-teal-600",
  "cat-4": "from-red-500 to-rose-600",
  "cat-5": "from-purple-500 to-violet-600",
  "cat-6": "from-cyan-500 to-sky-600",
};

function CategoriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
            Categories
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
            Browse by category
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Find the perfect rental from our wide range of categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Laptop;
            const gradient = colorMap[category.id] || "from-primary-500 to-primary-600";

            return (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 hover-lift"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {category.description}
                </p>
                <p className="mt-3 text-xs font-medium text-primary-600">
                  {category.productCount} products available
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { CategoriesSection };
