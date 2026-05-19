import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonBackButton,
} from '@ionic/react';
import {
  searchOutline,
  personOutline,
  calendarOutline,
  medkitOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import './super-admin.css';

const HealerPatientsPage: React.FC = () => {
  const { branchId, healerId } = useParams<{ branchId: string; healerId: string }>();
  const branchName = branchId ? decodeURIComponent(branchId) : 'Branch';
  const healerName = healerId ? decodeURIComponent(healerId) : 'Healer';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const patientData = [
    { id: 1, name: 'Robert Baratheon', age: 45, gender: 'Male', condition: 'Chronic Back Pain', lastSession: '2026-05-01', status: 'Active' },
    { id: 2, name: 'Catelyn Stark', age: 42, gender: 'Female', condition: 'Anxiety', lastSession: '2026-05-03', status: 'Active' },
    { id: 3, name: 'Jon Snow', age: 24, gender: 'Male', condition: 'Post-Surgery Recovery', lastSession: '2026-05-04', status: 'Active' },
    { id: 4, name: 'Sansa Stark', age: 21, gender: 'Female', condition: 'Migraines', lastSession: '2026-05-02', status: 'Active' },
    { id: 5, name: 'Arya Stark', age: 18, gender: 'Female', condition: 'Sports Injury', lastSession: '2026-04-28', status: 'Inactive' },
    { id: 6, name: 'Tyrion Lannister', age: 38, gender: 'Male', condition: 'Hypertension', lastSession: '2026-05-05', status: 'Active' },
  ];

  const filteredPatients = patientData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Practitioner Patients</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <h1 className="sa-page__title">Patients of {healerName}</h1>
            <p className="sa-page__subtitle">{branchName} • Active Assignments</p>
          </div>

          <div className="sa-section" style={{ padding: '16px 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="sa-search" style={{ marginBottom: 0, maxWidth: '400px' }}>
                <IonIcon icon={searchOutline} />
                <input 
                  placeholder="Search patient or condition..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f6fa', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e8ecf1' }}>
                <IonIcon icon={personOutline} style={{ color: '#64748b', fontSize: '18px' }} />
                <select 
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="sa-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="sa-table-container">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Patient Details</th>
                    <th>Age/Gender</th>
                    <th>Primary Condition</th>
                    <th>Last Session</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>
                          <div className="sa-table__user">
                            <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '36px', height: '36px' }}>
                              {patient.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <span className="sa-table__user-name">{patient.name}</span>
                          </div>
                        </td>
                        <td>{patient.age} / {patient.gender}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IonIcon icon={medkitOutline} style={{ fontSize: '16px', color: '#64748b' }} />
                            {patient.condition}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IonIcon icon={calendarOutline} style={{ fontSize: '16px', color: '#64748b' }} />
                            {patient.lastSession}
                          </div>
                        </td>
                        <td>
                          <span className={`sa-badge ${patient.status.toLowerCase() === 'active' ? 'sa-badge--active' : 'sa-badge--inactive'}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="sa-table__action-btn">
                            <IonIcon icon={chevronForwardOutline} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '0' }}>
                        <div className="sa-empty-state" style={{ border: 'none', background: 'transparent', margin: '0' }}>
                          <div className="sa-empty-state__icon">
                            <IonIcon icon={personOutline} />
                          </div>
                          <h3 className="sa-empty-state__title">No patients found</h3>
                          <p className="sa-empty-state__text">
                            {searchQuery 
                              ? `No patients matching "${searchQuery}" were found.` 
                              : `There are currently no patients assigned to ${healerName} matching the selected filters.`}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HealerPatientsPage;
