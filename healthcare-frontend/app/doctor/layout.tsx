export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="doctor-root">
      {children}
    </div>
  );
}
