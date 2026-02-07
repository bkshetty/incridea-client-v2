export default function EventDetails({ details }: { details: string }) {
  
  return (
    <div 
      className="event-description w-full prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-50 prose-a:text-sky-400 max-w-none"
      dangerouslySetInnerHTML={{ __html: details }} 
    />
  );
}
