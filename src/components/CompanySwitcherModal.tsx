import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { Building, Edit } from 'lucide-react';
import { CompanyEditModal } from './CompanyEditModal';

interface Company {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CompanyData {
  name: string;
  taxRate: number;
  proLaboreRate: number;
  inssRate: number;
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

// SVG do botão de adicionar empresa
const AddCompanyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_add_company" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
      <rect width="40" height="40" fill="#43464D"/>
    </mask>
    <g mask="url(#mask0_add_company)">
      <path d="M18.7493 21.2493V26.666C18.7493 27.0202 18.8692 27.317 19.1089 27.5564C19.3487 27.7962 19.6456 27.916 19.9998 27.916C20.3542 27.916 20.651 27.7962 20.8902 27.5564C21.1296 27.317 21.2493 27.0202 21.2493 26.666V21.2493H26.666C27.0202 21.2493 27.317 21.1295 27.5564 20.8898C27.7962 20.65 27.916 20.3531 27.916 19.9989C27.916 19.6445 27.7962 19.3477 27.5564 19.1085C27.317 18.8691 27.0202 18.7493 26.666 18.7493H21.2493V13.3327C21.2493 12.9785 21.1295 12.6817 20.8898 12.4423C20.65 12.2025 20.3531 12.0827 19.9989 12.0827C19.6445 12.0827 19.3477 12.2025 19.1085 12.4423C18.8691 12.6817 18.7493 12.9785 18.7493 13.3327V18.7493H13.3327C12.9785 18.7493 12.6817 18.8692 12.4423 19.1089C12.2025 19.3487 12.0827 19.6456 12.0827 19.9998C12.0827 20.3542 12.2025 20.651 12.4423 20.8902C12.6817 21.1296 12.9785 21.2493 13.3327 21.2493H18.7493ZM20.0023 35.8327C17.8123 35.8327 15.7538 35.4171 13.8268 34.586C11.8999 33.7549 10.2238 32.627 8.79851 31.2023C7.37324 29.7775 6.24477 28.1021 5.4131 26.176C4.58171 24.2499 4.16602 22.192 4.16602 20.0023C4.16602 17.8123 4.58157 15.7538 5.41268 13.8268C6.24379 11.8999 7.37171 10.2238 8.79643 8.79851C10.2212 7.37324 11.8966 6.24477 13.8227 5.4131C15.7488 4.58171 17.8067 4.16602 19.9964 4.16602C22.1864 4.16602 24.2449 4.58157 26.1718 5.41268C28.0988 6.24379 29.7749 7.37171 31.2002 8.79643C32.6255 10.2212 33.7539 11.8966 34.5856 13.8227C35.417 15.7488 35.8327 17.8067 35.8327 19.9964C35.8327 22.1864 35.4171 24.2449 34.586 26.1718C33.7549 28.0988 32.627 29.7749 31.2023 31.2002C29.7775 32.6255 28.1021 33.7539 26.176 34.5856C24.2499 35.417 22.192 35.8327 20.0023 35.8327Z" fill="url(#paint0_linear_add_company)"/>
    </g>
    <defs>
      <linearGradient id="paint0_linear_add_company" x1="-8.20377" y1="-2.50065" x2="48.1402" y2="-0.781195" gradientUnits="userSpaceOnUse">
        <stop stopColor="#78B60F"/>
        <stop offset="1" stopColor="#6D96E4"/>
      </linearGradient>
    </defs>
  </svg>
);

// SVG do radio button selecionado
const SelectedRadioIcon = ({ uniqueId }: { uniqueId: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id={`mask0_radio_${uniqueId}`} style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
      <rect width="24" height="24" fill="#43464D"/>
    </mask>
    <g mask={`url(#mask0_radio_${uniqueId})`}>
      <path d="M13.1075 15C13.9665 15 14.6966 14.7083 15.2979 14.125C15.8992 13.5417 16.1998 12.8333 16.1998 12C16.1998 11.1667 15.8992 10.4583 15.2979 9.875C14.6966 9.29167 13.9665 9 13.1075 9C12.2485 9 11.5184 9.29167 10.9171 9.875C10.3158 10.4583 10.0152 11.1667 10.0152 12C10.0152 12.8333 10.3158 13.5417 10.9171 14.125C11.5184 14.7083 12.2485 15 13.1075 15ZM13.1075 22C11.6816 22 10.3416 21.7375 9.0875 21.2125C7.83339 20.6875 6.7425 19.975 5.8148 19.075C4.88711 18.175 4.15269 17.1167 3.61154 15.9C3.07038 14.6833 2.7998 13.3833 2.7998 12C2.7998 10.6167 3.07038 9.31667 3.61154 8.1C4.15269 6.88333 4.88711 5.825 5.8148 4.925C6.7425 4.025 7.83339 3.3125 9.0875 2.7875C10.3416 2.2625 11.6816 2 13.1075 2C14.5334 2 15.8734 2.2625 17.1275 2.7875C18.3816 3.3125 19.4725 4.025 20.4002 4.925C21.3279 5.825 22.0623 6.88333 22.6035 8.1C23.1446 9.31667 23.4152 10.6167 23.4152 12C23.4152 13.3833 23.1446 14.6833 22.6035 15.9C22.0623 17.1167 21.3279 18.175 20.4002 19.075C19.4725 19.975 18.3816 20.6875 17.1275 21.2125C15.8734 21.7375 14.5334 22 13.1075 22Z" fill={`url(#paint0_linear_radio_${uniqueId})`}/>
    </g>
    <defs>
      <linearGradient id={`paint0_linear_radio_${uniqueId}`} x1="-5.25308" y1="-2.21053" x2="31.4254" y2="-1.05676" gradientUnits="userSpaceOnUse">
        <stop stopColor="#78B60F"/>
        <stop offset="1" stopColor="#6D96E4"/>
      </linearGradient>
    </defs>
  </svg>
);

export const CompanySwitcherModal: React.FC<CompanySwitcherModalProps> = ({
  onClose,
  isOpen,
  onSelectCompany,
  onRegisterNewCompany,
  onEditCompany
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>('1');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

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
    setEditingCompanyId(companyId);
    setIsEditModalOpen(true);
  };

  const handleSaveCompanyData = (companyData: CompanyData) => {
    console.log('Company data saved:', companyData, 'for company ID:', editingCompanyId);
    setIsEditModalOpen(false);
    setEditingCompanyId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 overflow-hidden ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[61] transition-all duration-300 ease-out shadow-xl max-w-[500px] mx-auto ${
            isClosing ? 'translate-y-full' : 'translate-y-0'
          } ${!isClosing && isOpen ? 'animate-slide-in-bottom' : ''}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="py-3 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-xl font-semibold text-gray-800">Trocar empresa</h2>
            <button 
              onClick={onRegisterNewCompany}
              className="p-0 hover:opacity-80 transition-opacity"
            >
              <AddCompanyIcon />
            </button>
          </div>

          {/* Company List */}
          <div className="px-5 py-4">
            {mockCompanies.map((company, index) => (
              <div key={company.id}>
                <div
                  className="company-item flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors"
                  onClick={() => handleCompanySelect(company.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="custom-radio w-6 h-6 flex items-center justify-center cursor-pointer">
                      {selectedCompanyId === company.id ? (
                        <SelectedRadioIcon uniqueId={company.id} />
                      ) : (
                        <div className="w-[22px] h-[22px] border-2 border-gray-400 rounded-full bg-white"></div>
                      )}
                    </div>
                    <Building className="text-gray-600" size={24} />
                    <span className="text-gray-700 font-medium">{company.name}</span>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                    onClick={(e) => handleEditCompany(company.id, e)}
                  >
                    <Edit size={20} />
                  </button>
                </div>
                
                {/* Separator (except for last item) */}
                {index < mockCompanies.length - 1 && (
                  <div className="mt-4">
                    <div className="h-px bg-gray-200"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Apply Button */}
          <div className="px-5 py-6">
            <button
              className="w-full bg-black text-white font-semibold py-3.5 rounded-xl transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 hover:bg-gray-900"
              onClick={handleApplySelection}
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>

      {/* Company Edit Modal */}
      <CompanyEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCompanyId(null);
        }}
        onSave={handleSaveCompanyData}
        companyData={{
          name: mockCompanies.find(c => c.id === editingCompanyId)?.name || '',
          taxRate: 6,
          proLaboreRate: 28,
          inssRate: 11
        }}
      />
    </>
  );
};
