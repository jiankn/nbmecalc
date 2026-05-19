export function LogoWall() {
  const schools = [
    "Harvard Medical",
    "Johns Hopkins",
    "Stanford",
    "UCSF",
    "Duke SOM",
    "Mayo Clinic",
    "Yale",
  ];

  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="container">
        <p className="text-center text-sm font-medium text-gray-500 mb-6">
          Featured users from medical schools across the US, Caribbean & IMG hubs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
          {schools.map((s) => (
            <span
              key={s}
              className="font-bold text-lg text-gray-600 tracking-tight"
              style={{ fontFamily: "Plus Jakarta Sans, serif" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
