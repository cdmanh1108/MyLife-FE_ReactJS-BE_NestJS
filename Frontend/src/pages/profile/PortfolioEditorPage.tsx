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

  const { data: portfolio, isLoading, isError, refetch } = usePortfolio();
  const updateMutation = useUpdatePortfolio();

  // State fields
  const [name, setName] = useState('');
  const [initials, setInitials] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneHref, setPhoneHref] = useState('');
  const [email, setEmail] = useState('');
  const [emailHref, setEmailHref] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [softSkills, setSoftSkills] = useState('');

  const [skillGroups, setSkillGroups] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);

  // Sync state with portfolio data on load
  useEffect(() => {
    if (portfolio) {
      setName(portfolio.name || '');
      setInitials(portfolio.initials || '');
      setRole(portfolio.role || '');
      setPhone(portfolio.phone || '');
      setPhoneHref(portfolio.phoneHref || '');
      setEmail(portfolio.email || '');
      setEmailHref(portfolio.emailHref || '');
      setPortfolioUrl(portfolio.portfolioUrl || '');
      setLinkedinUrl(portfolio.linkedinUrl || '');
      setCvUrl(portfolio.cvUrl || '');
      setTagline(portfolio.tagline || '');
      setAboutText((portfolio.about || []).join('\n\n'));
      setSoftSkills(portfolio.softSkills || '');
      setSkillGroups(portfolio.skillGroups || []);
      setExperiences(portfolio.experiences || []);
      setProjects(portfolio.projects || []);
      setEducation(portfolio.education || []);
    }
  }, [portfolio]);

  const handleSave = () => {
    if (!name.trim() || !role.trim()) {
      toast.error(t('common.required'));
      return;
    }

    const payload = {
      name: name.trim(),
      initials: initials.trim() || name.substring(0, 2).toUpperCase(),
      role: role.trim(),
      phone: phone.trim(),
      phoneHref: phoneHref.trim() || `tel:${phone.replace(/\s+/g, '')}`,
      email: email.trim(),
      emailHref: emailHref.trim() || `mailto:${email.trim()}`,
      portfolioUrl: portfolioUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      cvUrl: cvUrl.trim(),
      tagline: tagline.trim(),
      about: aboutText.trim().split('\n\n').filter(Boolean),
      softSkills: softSkills.trim(),
      skillGroups,
      experiences,
      projects,
      education,
    };

    updateMutation.mutate(payload, {
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
    setSkillGroups([...skillGroups, { label: 'New Group', skills: [] }]);
  };
  const removeSkillGroup = (index: number) => {
    setSkillGroups(skillGroups.filter((_, i) => i !== index));
  };
  const updateSkillGroupLabel = (index: number, label: string) => {
    const updated = [...skillGroups];
    updated[index].label = label;
    setSkillGroups(updated);
  };
  const updateSkillGroupSkills = (index: number, skillsStr: string) => {
    const updated = [...skillGroups];
    updated[index].skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    setSkillGroups(updated);
  };

  // Handler functions for Experiences
  const addExperience = () => {
    setExperiences([
      ...experiences,
      { position: 'New Position', company: 'Company Name', startDate: 'Start Date', endDate: 'End Date', highlights: [] }
    ]);
  };
  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };
  const updateExperience = (index: number, key: string, val: any) => {
    const updated = [...experiences];
    updated[index][key] = val;
    setExperiences(updated);
  };

  // Handler functions for Projects
  const addProject = () => {
    setProjects([
      ...projects,
      { name: 'New Project', period: 'Period', role: 'Role', summary: '', technologies: [], highlights: [], githubUrl: '', websiteUrl: '' }
    ]);
  };
  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };
  const updateProject = (index: number, key: string, val: any) => {
    const updated = [...projects];
    updated[index][key] = val;
    setProjects(updated);
  };

  // Handler functions for Education
  const addEducation = () => {
    setEducation([
      ...education,
      { school: 'School Name', degree: 'Degree', period: 'Period', details: [] }
    ]);
  };
  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };
  const updateEducation = (index: number, key: string, val: any) => {
    const updated = [...education];
    updated[index][key] = val;
    setEducation(updated);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Info size={14} /> },
    { id: 'skills', label: 'Skills', icon: <Globe size={14} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={14} /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={14} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={14} /> },
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
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Initials (e.g. CM)" value={initials} onChange={(e) => setInitials(e.target.value)} />
              </div>
              <Input label="Professional Role (e.g. Fullstack Developer)" value={role} onChange={(e) => setRole(e.target.value)} />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input label="Phone Href (tel:...)" value={phoneHref} onChange={(e) => setPhoneHref(e.target.value)} placeholder="Auto-generated if blank" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input label="Email Href (mailto:...)" value={emailHref} onChange={(e) => setEmailHref(e.target.value)} placeholder="Auto-generated if blank" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Portfolio Website URL" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
                <Input label="LinkedIn Profile URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                <Input label="CV / Resume PDF Path" value={cvUrl} onChange={(e) => setCvUrl(e.target.value)} />
              </div>

              <Textarea label="Tagline (Hero Summary)" value={tagline} onChange={(e) => setTagline(e.target.value)} rows={3} />
              
              <Textarea
                label="About Me (Separate paragraphs with double Enter / blank line)"
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={8}
              />

              <Textarea label="Soft Skills & General Qualities" value={softSkills} onChange={(e) => setSoftSkills(e.target.value)} rows={3} />
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-semibold text-foreground">Skill Groups</h3>
                <Button size="sm" onClick={addSkillGroup}>
                  <Plus size={14} /> Add Group
                </Button>
              </div>

              <div className="space-y-4">
                {skillGroups.map((group, index) => (
                  <div key={index} className="flex gap-4 items-start border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1 space-y-3">
                      <Input
                        label="Group Name (e.g. Frontend)"
                        value={group.label}
                        onChange={(e) => updateSkillGroupLabel(index, e.target.value)}
                      />
                      <Input
                        label="Skills (Comma-separated, e.g. React, Next.js, HTML)"
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
                <h3 className="text-sm font-semibold text-foreground">Work Experiences</h3>
                <Button size="sm" onClick={addExperience}>
                  <Plus size={14} /> Add Record
                </Button>
              </div>

              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="flex gap-4 items-start border-b border-border/40 pb-5 last:border-0 last:pb-0">
                    <div className="flex-1 grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Role / Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      />
                      <Input
                        label="Company / Workplace"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      />
                      <Input
                        label="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      />
                      <Input
                        label="End Date (or Present)"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label="Highlights (One bullet point per line)"
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
                <h3 className="text-sm font-semibold text-foreground">Portfolio Projects</h3>
                <Button size="sm" onClick={addProject}>
                  <Plus size={14} /> Add Project
                </Button>
              </div>

              <div className="space-y-6">
                {projects.map((proj, index) => (
                  <div key={index} className="flex gap-4 items-start border-b border-border/40 pb-5 last:border-0 last:pb-0">
                    <div className="flex-1 grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Project Name"
                        value={proj.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                      />
                      <Input
                        label="Timeline / Period"
                        value={proj.period}
                        onChange={(e) => updateProject(index, 'period', e.target.value)}
                      />
                      <Input
                        label="Your Role"
                        value={proj.role}
                        onChange={(e) => updateProject(index, 'role', e.target.value)}
                      />
                      <Input
                        label="Team Size (Optional)"
                        type="number"
                        value={proj.teamSize || ''}
                        onChange={(e) => updateProject(index, 'teamSize', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label="Project Summary"
                          value={proj.summary}
                          onChange={(e) => updateProject(index, 'summary', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <Input
                        label="Technologies (Comma-separated, e.g. React, Docker)"
                        value={(proj.technologies || []).join(', ')}
                        onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      />
                      <Input
                        label="GitHub Repository URL"
                        value={proj.githubUrl || ''}
                        onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                      />
                      <Input
                        label="Demo / Website URL"
                        value={proj.websiteUrl || ''}
                        onChange={(e) => updateProject(index, 'websiteUrl', e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label="Project Highlights (One bullet point per line)"
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
                <h3 className="text-sm font-semibold text-foreground">Education Details</h3>
                <Button size="sm" onClick={addEducation}>
                  <Plus size={14} /> Add School
                </Button>
              </div>

              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="flex gap-4 items-start border-b border-border/40 pb-5 last:border-0 last:pb-0">
                    <div className="flex-1 grid gap-4 sm:grid-cols-2">
                      <Input
                        label="School / University Name"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      />
                      <Input
                        label="Degree / Certificate"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                      <Input
                        label="Period / Years"
                        value={edu.period}
                        onChange={(e) => updateEducation(index, 'period', e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Textarea
                          label="Details (One highlight/score per line)"
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
