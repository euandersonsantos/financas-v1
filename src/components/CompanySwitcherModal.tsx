import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { X } from 'lucide-react';
import { Building, Plus, Pencil, PlusCircle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  icon?: React.ReactNode; // Optional: if you have specific icons per company
}

// Placeholder company data - replace with your actual data source
const mockCompanies: Company[] = [ // Using provided mock data from the image
  { id: '1', name: 'Anderson Design' }, 
  { id: '2', name: 'Clínica Zens' },
  { id: '3', name: 'Beta LLC', icon: <Building className="w-6 h-6 mr-3 text-gray-500" /> },
];

interface CompanySwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (companyId: string) => void; // Callback when a company is selected
  onRegisterNewCompany: () => void; // Callback for new company registration
}

export const CompanySwitcherModal: React.FC<CompanySwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectCompany,
  onRegisterNewCompany,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Duration of the closing animation
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 overflow-hidden ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose} // Close when clicking on the overlay
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-4 pb-6 z-[61] transition-all duration-300 ease-out ${
          isClosing ? 'translate-y-full' : 'translate-y-0'
        } ${!isClosing && isOpen ? 'animate-slide-in-bottom' : ''}`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Selecionar empresa</h2>
          <button onClick={handleClose} className="p-1 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Company List */}
        <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
          {mockCompanies.map((company) => (
            <div 
              key={company.id} 
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                {company.icon || <Building className="w-6 h-6 mr-3 text-gray-500" />}
                <span className="text-gray-700 font-medium">{company.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelectCompany(company.id)}
                className="bg-transparent border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white"
              >
                Selecionar
              </Button>
            </div>
          ))}
        </div>

        {/* Register New Company Button */}
        <Button 
          variant="default" 
          className="w-full bg-black text-white rounded-full font-semibold text-center hover:bg-gray-800 transition-colors h-[52px]"
          onClick={onRegisterNewCompany}
        >
          <PlusCircle size={20} className="mr-2" />
          Cadastrar nova empresa
        </Button>
      </div>
    </div>
  );
};
