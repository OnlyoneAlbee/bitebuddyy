import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/creators")({
  head: () => ({
    meta: [
      { title: "GROUP O CREATORS — BiteBuddy" },
      {
        name: "description",
        content:
          "Meet GROUP O CREATORS, the team behind the BiteBuddy / Chowly food delivery platform.",
      },
    ],
  }),
  component: CreatorsPage,
});

const CREATORS = [
  "Biney Enoch Onosetale",
  "Ogundare Samuel jesugbotemi",
  "Okoro Arinze David",
  "Job-Lesor David",
  "Akintunde Quadri Opeyemi",
  "Frank Albert",
  "Daud Balogun Oluwapelumi",
  "Prince Daniels",
  "Ogunwumiju Ifeoluwa kayode",
  "Alade Idris Oluwatobi",
];

function CreatorsPage() {
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
          The team
        </span>
        <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
          GROUP O CREATORS
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Chowly is a modern food delivery platform designed to help users
          discover restaurants, browse menus, place food orders, and enjoy a
          seamless delivery experience. The platform connects customers with
          restaurants through a simple, reliable, and user-friendly ordering
          system.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-4xl">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          THESE ARE THE CREATORS
        </h2>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {CREATORS.map((name, i) => (
            <li
              key={name}
              className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition hover:shadow-soft"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-hero-gradient text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span className="font-bold">{name}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
