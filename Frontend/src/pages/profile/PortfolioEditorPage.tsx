import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, Plus, Trash2, Globe, Briefcase, FolderGit2, GraduationCap, Info } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ROUTES } from '@/shared/constants/routes';
import { usePortfolio, useUpdatePortfolio } from '@/features/portfolio/api/usePortfolio';
import { toast } from 'sonner';

type TabType = 'general' | 'skills' | 'experience' | 'projects' | 'education';

export default function PortfolioEditorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [editLang, setEditLang] = useState<'en' | 'vi' | 'ko'>('en');

  const { data: portfolio, isLoading, isError, refetch } = usePortfolio();
  const updateMutation = useUpdatePortfolio();

  // Root level (global) states
  const [phone, setPhone] = useState('');
  const [phoneHref, setPhoneHref] = useState('');
  const [email, setEmail] = useState('');
  const [emailHref, setEmailHref] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [cvUrl, setCvUrl] = useState('');

  // Localized locale states
  const [locales, setLocales] = useState<Record<'en' | 'vi' | 'ko', any>>({
    en: { name: '', initials: '', role: '', tagline: '', aboutText: '', softSkills: '', skillGroups: [], experiences: [], projects: [], education: [] },
    vi: { name: '', initials: '', role: '', tagline: '', aboutText: '', softSkills: '', skillGroups: [], experiences: [], projects: [], education: [] },
    ko: { name: '', initials: '', role: '', tagline: '', aboutText: '', softSkills: '', skillGroups: [], experiences: [], projects: [], education: [] },
  });

  // Sync state with portfolio data on load
  useEffect(() => {
    if (portfolio) {
      setPhone(portfolio.phone || '');
      setPhoneHref(portfolio.phoneHref || '');
      setEmail(portfolio.email || '');
      setEmailHref(portfolio.emailHref || '');
      setPortfolioUrl(portfolio.portfolioUrl || '');
      setLinkedinUrl(portfolio.linkedinUrl || '');
      setCvUrl(portfolio.cvUrl || '');

      const newLocales = { ...locales };
      (['en', 'vi', 'ko'] as const).forEach((lang) => {
        const langData = portfolio.locales?.[lang] || {};
        newLocales[lang] = {
          name: langData.name || '',
          initials: langData.initials || '',
          role: langData.role || '',
          tagline: langData.tagline || '',
          aboutText: (langData.about || []).join('\n\n'),
          softSkills: langData.softSkills || '',
          skillGroups: langData.skillGroups || [],
          experiences: langData.experiences || [],
          projects: langData.projects || [],
          education: langData.education || [],
        };
      });
      setLocales(newLocales);
    }
  }, [portfolio]);

  const updateLocaleField = (field: string, value: any) => {
    setLocales((prev) => ({
      ...prev,
      [editLang]: {
        ...prev[editLang],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!locales.en.name.trim() || !locales.en.role.trim()) {
      toast.error(t('portfolio.editor.validation.required'));
      return;
    }

    const payload = {
      phone: phone.trim(),
      phoneHref: phoneHref.trim() || `tel:${phone.replace(/\s+/g, '')}`,
      email: email.trim(),
      emailHref: emailHref.trim() || `mailto:${email.trim()}`,
      portfolioUrl: portfolioUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      cvUrl: cvUrl.trim(),
      locales: {
        en: {
          ...locales.en,
          about: locales.en.aboutText.trim().split('\n\n').filter(Boolean),
        },
        vi: {
          ...locales.vi,
          about: locales.vi.aboutText.trim().split('\n\n').filter(Boolean),
        },
        ko: {
          ...locales.ko,
          about: locales.ko.aboutText.trim().split('\n\n').filter(Boolean),
        },
      },
    };

    updateMutation.mutate(payload as any, {
      onSuccess: () => {
        toast.success(t('portfolio.toastUpdateSuccess'));
        refetch();
      },
      onError: () => {
        toast.error(t('portfolio.toastUpdateError'));
      },
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('portfolio.toastUpdateError')} onRetry={refetch} />;

  // Handler functions for Skill Groups
  const addSkillGroup = () => {
    const current = locales[editLang].skillGroups || [];
    updateLocaleField('skillGroups', [...current, { label: 'New Group', skills: [] }]);
  };
  const removeSkillGroup = (index: number) => {
    const current = locales[editLang].skillGroups || [];
    updateLocaleField('skillGroups', current.filter((_: any, i: number) => i !== index));
  };
  const updateSkillGroupLabel = (index: number, label: string) => {
    const current = [...(locales[editLang].skillGroups || [])];
    current[index].label = label;
    updateLocaleField('skillGroups', current);
  };
  const updateSkillGroupSkills = (index: number, skillsStr: string) => {
    const current = [...(locales[editLang].skillGroups || [])];
    current[index].skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    updateLocaleField('skillGroups', current);
  };

  // Handler functions for Experiences
  const addExperience = () => {
    const current = locales[editLang].experiences || [];
    updateLocaleField('experiences', [
      ...current,
      { position: 'New Position', company: 'Company Name', startDate: 'Start Date', endDate: 'End Date', highlights: [] }
    ]);
  };
  const removeExperience = (index: number) => {
    const current = locales[editLang].experiences || [];
    updateLocaleField('experiences', current.filter((_: any, i: number) => i !== index));
  };
  const updateExperience = (index: number, key: string, val: any) => {
    const current = [...(locales[editLang].experiences || [])];
    current[index] = { ...current[index], [key]: val };
    updateLocaleField('experiences', current);
  };

  // Handler functions for Projects
  const addProject = () => {
    const current = locales[editLang].projects || [];
    updateLocaleField('projects', [
      ...current,
      { name: 'New Project', period: 'Period', role: 'Role', summary: '', technologies: [], highlights: [], githubUrl: '', websiteUrl: '' }
    ]);
  };
  const removeProject = (index: number) => {
    const current = locales[editLang].projects || [];
    updateLocaleField('projects', current.filter((_: any, i: number) => i !== index));
  };
  const updateProject = (index: number, key: string, val: any) => {
    const current = [...(locales[editLang].projects || [])];
    current[index] = { ...current[index], [key]: val };
    updateLocaleField('projects', current);
  };

  // Handler functions for Education
  const addEducation = () => {
    const current = locales[editLang].education || [];
    updateLocaleField('education', [
      ...current,
      { school: 'School Name', degree: 'Degree', period: 'Period', details: [] }
    ]);
  };
  const removeEducation = (index: number) => {
    const current = locales[editLang].education || [];
    updateLocaleField('education', current.filter((_: any, i: number) => i !== index));
  };
  const updateEducation = (index: number, key: string, val: any) => {
    const current = [...(locales[editLang].education || [])];
    current[index] = { ...current[index], [key]: val };
    updateLocaleField('education', current);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: t('portfolio.editor.tabs.general'), icon: <Info size={14} /> },
    { id: 'skills', label: t('portfolio.editor.tabs.skills'), icon: <Globe size={14} /> },
    { id: 'experience', label: t('portfolio.editor.tabs.experience'), icon: <Briefcase size={14} /> },
    { id: 'projects', label: t('portfolio.editor.tabs.projects'), icon: <FolderGit2 size={14} /> },
    { id: 'education', label: t('portfolio.editor.tabs.education'), icon: <GraduationCap size={14} /> },
  ];

  return (
    <div className="max-w-4xl space-y-5 animate-slide-up pb-10">
      <PageHeader
        title={t('portfolio.editTitle')}
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} loading={updateMutation.isPending}>
              <Save size={14} />
              {t('common.save')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.PROFILE)}>
              <ArrowLeft size={14} />
              {t('common.back')}
            </Button>
          </div>
        }
      />

      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-secondary p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="card-glow">
        <CardContent className="p-6">
          {/* Active Editing Language Selector */}
          <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex gap-2">
              {(['en', 'vi', 'ko'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setEditLang(lang)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    editLang === lang
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }`}
                >
                  {lang === 'en' ? 'English (EN)' : lang === 'vi' ? 'Tiếng Việt (VI)' : '한국어 (KO)'}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">
              {t('portfolio.editor.editing')} <span className="text-primary font-bold uppercase">{editLang}</span>
            </span>
          </div>

          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t('portfolio.editor.labels.fullName')} value={locales[editLang].name} onChange={(e) => updateLocaleField('name', e.target.value)} />
                <Input label={t('portfolio.editor.labels.initials')} value={locales[editLang].initials} onChange={(e) => updateLocaleField('initials', e.target.value)} />
              </div>
              <Input label={t('portfolio.editor.labels.role')} value={locales[editLang].role} onChange={(e) => updateLocaleField('role', e.target.value)} />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t('portfolio.editor.labels.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input label={t('portfolio.editor.labels.phoneHref')} value={phoneHref} onChange={(e) => setPhoneHref(e.target.value)} placeholder={t('portfolio.editor.placeholderAuto')} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t('portfolio.editor.labels.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input label={t('portfolio.editor.labels.emailHref')} value={emailHref} onChange={(e) => setEmailHref(e.target.value)} placeholder={t('portfolio.editor.placeholderAuto')} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input label={t('portfolio.editor.labels.portfolioUrl')} value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
                <Input label={t('portfolio.editor.labels.linkedinUrl')} value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                <Input label={t('portfolio.editor.labels.cvUrl')} value={cvUrl} onChange={(e) => setCvUrl(e.target.value)} />
              </div>

              <Textarea label={t('portfolio.editor.labels.tagline')} value={locales[editLang].tagline} onChange={(e) => updateLocaleField('tagline', e.target.value)} rows={3} />
              
              <Textarea
                label={t('portfolio.editor.labels.aboutMe')}
                value={locales[editLang].aboutText}
                onChange={(e) => updateLocaleField('aboutText', e.target.value)}
                rows={8}
              />

              <Textarea label={t('portfolio.editor.labels.softSkills')} value={locales[editLang].softSkills} onChange={(e) => updateLocaleField('softSkills', e.target.value)} rows={3} />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-semibold text-foreground">{t('portfolio.editor.labels.skillGroups')}</h3>
                <Button size="sm" onClick={addSkillGroup}>
                  <Plus size={14} /> {t('portfolio.editor.labels.addGroup')}
                </Button>
              </div>

              <div className="space-y-4">
                {(locales[editLang].skillGroups || []).map((group: any, index: number) => (
                  <div key={index} className="flex gap-4 items-start border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1 space-y-3">
                      <Input
                        label={t('portfolio.editor.labels.groupName')}
                        value={group.label}
                        onChange={(e) => updateSkillGroupLabel(index, e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.skillsList')}
                        value={(group.skills || []).join(', ')}
                        onChange={(e) => updateSkillGroupSkills(index, e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" className="text-destructive mt-6 hover:bg-destructive/10" size="sm" onClick={() => removeSkillGroup(index)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-semibold text-foreground">{t('portfolio.editor.labels.workExperiences')}</h3>
                <Button size="sm" onClick={addExperience}>
                  <Plus size={14} /> {t('portfolio.editor.labels.addRecord')}
                </Button>
              </div>

              <div className="space-y-6">
                {(locales[editLang].experiences || []).map((exp: any, index: number) => (
                  <div key={index} className="flex gap-4 items-start border-b border-border/40 pb-5 last:border-0 last:pb-0">
                    <div className="flex-1 grid gap-4 sm:grid-cols-2">
                      <Input
                        label={t('portfolio.editor.labels.rolePosition')}
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.companyWorkplace')}
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.startDate')}
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.endDate')}
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label={t('portfolio.editor.labels.highlights')}
                          value={(exp.highlights || []).join('\n')}
                          onChange={(e) => updateExperience(index, 'highlights', e.target.value.split('\n').filter(Boolean))}
                          rows={4}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" className="text-destructive mt-6 hover:bg-destructive/10" size="sm" onClick={() => removeExperience(index)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-semibold text-foreground">{t('portfolio.editor.labels.portfolioProjects')}</h3>
                <Button size="sm" onClick={addProject}>
                  <Plus size={14} /> {t('portfolio.editor.labels.addProject')}
                </Button>
              </div>

              <div className="space-y-6">
                {(locales[editLang].projects || []).map((proj: any, index: number) => (
                  <div key={index} className="flex gap-4 items-start border-b border-border/40 pb-5 last:border-0 last:pb-0">
                    <div className="flex-1 grid gap-4 sm:grid-cols-2">
                      <Input
                        label={t('portfolio.editor.labels.projectName')}
                        value={proj.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.timelinePeriod')}
                        value={proj.period}
                        onChange={(e) => updateProject(index, 'period', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.yourRole')}
                        value={proj.role}
                        onChange={(e) => updateProject(index, 'role', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.teamSize')}
                        type="number"
                        value={proj.teamSize || ''}
                        onChange={(e) => updateProject(index, 'teamSize', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label={t('portfolio.editor.labels.projectSummary')}
                          value={proj.summary}
                          onChange={(e) => updateProject(index, 'summary', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <Input
                        label={t('portfolio.editor.labels.technologies')}
                        value={(proj.technologies || []).join(', ')}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      />
                      <Input
                        label={t('portfolio.editor.labels.githubUrl')}
                        value={proj.githubUrl || ''}
                        onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.websiteUrl')}
                        value={proj.websiteUrl || ''}
                        onChange={(e) => updateProject(index, 'websiteUrl', e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label={t('portfolio.editor.labels.highlights')}
                          value={(proj.highlights || []).join('\n')}
                          onChange={(e) => updateProject(index, 'highlights', e.target.value.split('\n').filter(Boolean))}
                          rows={4}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" className="text-destructive mt-6 hover:bg-destructive/10" size="sm" onClick={() => removeProject(index)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-semibold text-foreground">{t('portfolio.editor.labels.educationDetails')}</h3>
                <Button size="sm" onClick={addEducation}>
                  <Plus size={14} /> {t('portfolio.editor.labels.addSchool')}
                </Button>
              </div>

              <div className="space-y-6">
                {(locales[editLang].education || []).map((edu: any, index: number) => (
                  <div key={index} className="flex gap-4 items-start border-b border-border/40 pb-5 last:border-0 last:pb-0">
                    <div className="flex-1 grid gap-4 sm:grid-cols-2">
                      <Input
                        label={t('portfolio.editor.labels.schoolName')}
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.degreeCertificate')}
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                      <Input
                        label={t('portfolio.editor.labels.periodYears')}
                        value={edu.period}
                        onChange={(e) => updateEducation(index, 'period', e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label={t('portfolio.editor.labels.detailsList')}
                          value={(edu.details || []).join('\n')}
                          onChange={(e) => updateEducation(index, 'details', e.target.value.split('\n').filter(Boolean))}
                          rows={3}
                        />
                      </div>
                    </div>
                    <Button variant="ghost" className="text-destructive mt-6 hover:bg-destructive/10" size="sm" onClick={() => removeEducation(index)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
