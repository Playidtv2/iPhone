import React, { useState } from 'react';
import { Search, Folder, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { Category } from '../types/iptv';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  isAdultUnlocked: boolean;
  totalItemsCount?: number;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isAdultUnlocked,
  totalItemsCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const isAdultCategory = (name: string) => {
    const kws = ['18+', 'adult', 'xxx', 'porn', 'nsfw', 'ผู้ใหญ่', 'onlyfans'];
    return kws.some((kw) => name.toLowerCase().includes(kw));
  };

  const filteredCategories = categories.filter((cat) => {
    if (!isAdultUnlocked && isAdultCategory(cat.category_name)) return false;
    if (!searchTerm) return true;
    return cat.category_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <aside className="w-full lg:w-72 bg-slate-950/70 border-r border-slate-800/80 p-4 flex flex-col h-auto lg:h-[calc(100vh-4rem)] select-none">
      {/* Search Header */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหาหมวดหมู่..."
          className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
        />
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {/* All items option */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
            selectedCategoryId === null
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
              : 'text-slate-300 hover:bg-slate-900/90 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">🌟 รายการทั้งหมด (All)</span>
          </div>
          {totalItemsCount !== undefined && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                selectedCategoryId === null ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {totalItemsCount}
            </span>
          )}
        </button>

        {filteredCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.category_id;
          return (
            <button
              key={cat.category_id}
              onClick={() => onSelectCategory(cat.category_id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                  : 'text-slate-300 hover:bg-slate-900/90 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Folder className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">{cat.category_name}</span>
              </div>
              {cat.count !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-1 ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500">
            ไม่พบหมวดหมู่ที่ค้นหา
          </div>
        )}
      </div>
    </aside>
  );
};
