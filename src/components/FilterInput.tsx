interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FilterInput = ({ value, onChange }: FilterInputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
    />
  );
};

export default FilterInput; 