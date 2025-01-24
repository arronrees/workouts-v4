export default function PageStructure({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className='flex flex-1 flex-col gap-4 lg:gap-6'>{children}</div>;
}
