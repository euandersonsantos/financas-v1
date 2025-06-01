
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { PlusCircle, Building, Edit } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

// Placeholder company data
const mockCompanies: Company[] = [
  { id: '1', name: 'Anderson Design' },
  { id: '2', name: 'Clínica Zens' },
];

interface CompanySwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (companyId: string) => void;
  onRegisterNewCompany?: () => void;
  onEditCompany?: (companyId: string) => void;
}

export const CompanySwitcherModal: React.FC<CompanySwitcherModalProps> = ({
  onClose,
  isOpen,
  onSelectCompany,
  onRegisterNewCompany,
  onEditCompany,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>('1'); // Default to first company

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
    }, 300);
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleApplySelection = () => {
    if (selectedCompanyId) {
      onSelectCompany(selectedCompanyId);
    }
    handleClose();
  };

  const handleEditCompany = (companyId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEditCompany) {
      onEditCompany(companyId);
    }
  };

  if (!isOpen) return null;

  const customRadioStyles = `
    .custom-radio {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid #D1D5DB;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    .custom-radio.selected {
      border-color: #2DD4BF;
      background-color: #2DD4BF;
    }
    .custom-radio.selected::after {
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #2DD4BF;
    }
  `;

  return (
    <div 
      className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 overflow-hidden ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <style dangerouslySetInnerHTML={{ __html: customRadioStyles }} />
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[61] transition-all duration-300 ease-out shadow-xl ${
          isClosing ? 'translate-y-full' : 'translate-y-0'
        } ${!isClosing && isOpen ? 'animate-slide-in-bottom' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="py-2 flex justify-center">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Trocar empresa</h2>
          <button 
            onClick={onRegisterNewCompany}
            className="text-gray-600 hover:text-teal-500 transition-colors"
          >
            <PlusCircle size={28} />
          </button>
        </div>

        {/* Company List */}
        <div className="p-4 space-y-3">
          {mockCompanies.map((company) => (
            <div
              key={company.id}
              className="company-item flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleCompanySelect(company.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`custom-radio ${selectedCompanyId === company.id ? 'selected' : ''}`}
                ></div>
                <Building className="text-gray-600" size={24} />
                <span className="text-gray-700 font-medium">{company.name}</span>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={(e) => handleEditCompany(company.id, e)}
              >
                <Edit size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Apply Button */}
        <div className="p-4 mt-4">
          <Button
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out"
            onClick={handleApplySelection}
          >
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
};
