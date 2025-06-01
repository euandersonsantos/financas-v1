import { Button } from '@/components/ui/button';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Building, PlusCircle, X } from 'lucide-react';
import { MaterialSymbolsOutlined as Icon } from '@/components/icons';
interface Company {
  id: string;
  name: string;
  icon?: React.ReactNode; // Optional: if you have specific icons per company
}

// Placeholder company data - replace with your actual data source
const mockCompanies: Company[] = [
  { id: '1', name: 'Anderson Design' },
  { id: '2', name: 'Clínica Zens' },
];

interface CompanySwitcherModalProps {
  isOpen: boolean; // Controls the visibility of the modal
  onClose: () => void; // Function to close the modal
  onSelectCompany: (companyId: string) => void; // Callback function when a company is selected
  onRegisterNewCompany?: () => void; // Optional: Callback for registering a new company
}

export const CompanySwitcherModal: React.FC<CompanySwitcherModalProps> = ({
  onClose,
  isOpen,
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

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleApplySelection = () => {
    if (selectedCompanyId) {
      onSelectCompany(selectedCompanyId);
    }
    handleClose(); // Close modal after applying
  };
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 overflow-hidden ${isClosing ? 'opacity-0' : 'opacity-100'}`}
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
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Company List */}
        <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
          {mockCompanies.map((company) => (
            <div
              key={company.id}
              className="company-item flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleCompanySelect(company.id)}
            >
              <div className="flex items-center">
                <div
                  className={`custom-radio ${selectedCompanyId === company.id ? 'selected' : ''}`}
                ></div>
                <span className="text-gray-700 font-medium">{company.name}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Apply Button */} {/* Moved below company list */}
        <Button
          className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out"
          onClick={handleApplySelection}
        >
          Aplicar
        </Button>
        
        {/* Register New Company Button */} {/* Moved below Apply Button for better flow */}
        {/* You might want to make this conditional based on user permissions */}
        <Button
          variant="default"
          className="w-full bg-black text-white rounded-full font-semibold text-center hover:bg-gray-800 transition-colors h-[52px] mt-3"
          onClick={onRegisterNewCompany}
        >
          <PlusCircle size={20} className="mr-2" />
          Cadastrar nova empresa
        </Button>
      </div>
      
      {/* Add custom styles for the radio button */}
      <style jsx>{`
        .custom-radio {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid #D1D5DB; /* gray-300 */ /* Adjusted to match HTML comment */
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        .custom-radio.selected {
            border-color: #2DD4BF; /* teal-400 - Cor aproximada da imagem */
            background-color: #2DD4BF; /* teal-400 */
        }
        .custom-radio.selected::after {
            content: '';
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #2DD4BF; /* Mantem a cor de fundo, pois o design é um círculo preenchido */
        }
      `}</style>
    </div>
  );
};
