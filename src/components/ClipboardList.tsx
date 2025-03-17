import ClipboardCard from './ClipboardCard';

interface ClipboardItem {
  text: string;
  appTitle: string;
}

interface ClipboardListProps {
  items: ClipboardItem[];
}

const ClipboardList = ({ items }: ClipboardListProps) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item, index) => (
        <ClipboardCard
          key={index}
          text={item.text}
          appTitle={item.appTitle}
        />
      ))}
    </div>
  );
};

export default ClipboardList; 