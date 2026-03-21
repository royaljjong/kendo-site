import React, { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  Info,
  Lock,
  LogOut,
  MapPin,
  Medal,
  Phone,
  Swords,
  Trophy,
  Users,
  Wallet,
  X,
} from 'lucide-react'

const INITIAL_MEMBERS = [
  { id: 'm1', name: '김민준', ageGroup: '초등부', active: true, baseTuition: 150000, createdAt: '2026-01-10' },
  { id: 'm2', name: '이서연', ageGroup: '초등부', active: true, baseTuition: 150000, createdAt: '2026-02-15' },
  { id: 'm3', name: '박도현', ageGroup: '중등부', active: true, baseTuition: 160000, createdAt: '2025-11-20' },
  { id: 'm4', name: '최지우', ageGroup: '고등부', active: true, baseTuition: 170000, createdAt: '2025-08-05' },
  { id: 'm5', name: '정태양', ageGroup: '초등부', active: false, baseTuition: 150000, createdAt: '2025-05-12' },
]

const INITIAL_TUITIONS = [
  {
    id: 't1', memberId: 'm1', billingMonth: '2026-03', baseAmount: 150000,
    discountAmount: 0, finalAmount: 150000, paidAmount: 150000,
    paymentStatus: 'paid', discountReason: '', memo: '현금 영수증', paidAt: '2026-03-02T10:00:00Z'
  },
  {
    id: 't2', memberId: 'm2', billingMonth: '2026-03', baseAmount: 150000,
    discountAmount: 20000, finalAmount: 130000, paidAmount: 0,
    paymentStatus: 'unpaid', discountReason: '형제 할인', memo: '', paidAt: null
  },
  {
    id: 't3', memberId: 'm3', billingMonth: '2026-03', baseAmount: 160000,
    discountAmount: 0, finalAmount: 160000, paidAmount: 160000,
    paymentStatus: 'paid', discountReason: '', memo: '', paidAt: '2026-03-05T14:30:00Z'
  },
]

const ACHIEVEMENTS = [
  { id: 'a1', year: '2025', category: '관장경력', title: '제XX회 사회인검도대회 청년부 단체전 우승', desc: '전국 120개 팀 출전, 압도적인 기량으로 우승 달성' },
  { id: 'a2', year: '2025', category: '도장실적', title: '경기도지사기 검도대회 초등부 준우승', desc: '창단 이래 최고 성적, 안성시 대표로 출전' },
  { id: 'a3', year: '2024', category: '관장경력', title: '대한검도회 우수지도자상 수상', desc: '바른 인성 교육과 검도 저변 확대 공로 인정' },
]

const INITIAL_POSTS = [
  { id: 'post1', type: 'notice', title: '3월 승급심사 안내', content: '이번 달 승급심사는 28일(토) 오후 2시에 진행됩니다.', imageUrl: '', isPublished: true, createdAt: '2026-03-05' },
  { id: 'post2', type: 'gallery', title: '주말 특별수련 및 체력훈련', content: '', imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800', isPublished: true, createdAt: '2026-03-02' },
]

export default function App() {
  const [currentPath, setCurrentPath] = useState('/')
  const [adminUser, setAdminUser] = useState(null)
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [tuitions, setTuitions] = useState(INITIAL_TUITIONS)
  const [posts, setPosts] = useState(INITIAL_POSTS)

  const navigate = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setCurrentPath(path)
  }

  const toggleMemberActive = (id) => {
    setMembers((prev) => prev.map((member) => (
      member.id === id ? { ...member, active: !member.active } : member
    )))
  }

  const createTuitionRecord = (memberId, billingMonth, baseAmount, autoPaid = false) => {
    const record = {
      id: `t_${Date.now()}_${Math.random()}`,
      memberId,
      billingMonth,
      baseAmount,
      discountAmount: 0,
      finalAmount: baseAmount,
      paidAmount: autoPaid ? baseAmount : 0,
      paymentStatus: autoPaid ? 'paid' : 'unpaid',
      discountReason: '',
      memo: '',
      paidAt: autoPaid ? new Date().toISOString() : null,
    }
    setTuitions((prev) => [...prev, record])
    return record
  }

  const toggleTuitionPaid = (recordId, memberId, billingMonth, baseAmount) => {
    if (!recordId) {
      createTuitionRecord(memberId, billingMonth, baseAmount, true)
      return
    }

    setTuitions((prev) => prev.map((record) => {
      if (record.id !== recordId) return record
      const isPaid = record.paymentStatus === 'paid'
      return {
        ...record,
        paymentStatus: isPaid ? 'unpaid' : 'paid',
        paidAmount: isPaid ? 0 : record.finalAmount,
        paidAt: isPaid ? null : new Date().toISOString(),
      }
    }))
  }

  const updateTuitionAmount = (recordId, updates) => {
    setTuitions((prev) => prev.map((record) => (
      record.id === recordId ? { ...record, ...updates } : record
    )))
  }

  const addMember = (newMember) => {
    setMembers((prev) => [
      ...prev,
      {
        ...newMember,
        id: `m_${Date.now()}`,
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ])
  }

  const addPost = (newPost) => {
    setPosts((prev) => [
      {
        ...newPost,
        id: `post_${Date.now()}`,
        isPublished: true,
        createdAt: new Date().toISOString().split('T')[0],
      },
      ...prev,
    ])
  }

  return (
    <div className="app-shell">
      <NavBar currentPath={currentPath} navigate={navigate} adminUser={adminUser} setAdminUser={setAdminUser} />

      <main>
        {currentPath === '/' && <HomePage posts={posts} />}
        {currentPath === '/admin/login' && <AdminLoginPage setAdminUser={setAdminUser} navigate={navigate} />}
        {currentPath === '/admin/dashboard' && adminUser && (
          <AdminDashboardPage
            members={members}
            tuitions={tuitions}
            posts={posts}
            toggleMemberActive={toggleMemberActive}
            toggleTuitionPaid={toggleTuitionPaid}
            updateTuitionAmount={updateTuitionAmount}
            addMember={addMember}
            addPost={addPost}
          />
        )}
      </main>

      {currentPath === '/' && <Footer />}
    </div>
  )
}

function NavBar({ currentPath, navigate, adminUser, setAdminUser }) {
  const isPublic = currentPath === '/'

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <button className="brand" onClick={() => navigate('/')}>
          <span className="brand-badge"><Swords size={20} /></span>
          <span>안성 대한검도관</span>
        </button>

        {isPublic && (
          <nav className="desktop-nav">
            <a href="#intro">관장소개</a>
            <a href="#achievements">명예의 전당</a>
            <a href="#programs">프로그램</a>
            <a href="#gallery">갤러리</a>
          </nav>
        )}

        <div className="topbar-actions">
          {adminUser ? (
            <button className="text-button" onClick={() => { setAdminUser(null); navigate('/') }}>
              <LogOut size={16} /> 로그아웃
            </button>
          ) : (
            <button className="text-button" onClick={() => navigate('/admin/login')}>
              <Lock size={16} /> 관리자
            </button>
          )}

          {isPublic && <a href="#contact" className="button button-primary">무료 체험 신청</a>}
          {currentPath === '/admin/dashboard' && <button className="button button-secondary" onClick={() => navigate('/')}>홈페이지 보기</button>}
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <div className="brand footer-brand">
            <span className="brand-badge"><Swords size={20} /></span>
            <span>안성 대한검도관</span>
          </div>
          <p>바른 예절과 강한 집중력.<br />아이의 성장은 하루 1시간의 수련에서 시작됩니다.</p>
        </section>

        <section>
          <h4>도장 정보</h4>
          <ul className="footer-list">
            <li><MapPin size={16} /> 경기도 안성시 [상세주소 입력 대기]</li>
            <li><Phone size={16} /> 0507-1387-6760</li>
            <li><Clock size={16} /> 평일 14:00 ~ 22:00</li>
          </ul>
        </section>

        <section>
          <h4>공식 커뮤니티</h4>
          <ul className="footer-list">
            <li><a href="https://cafe.naver.com/ansungkumdo" target="_blank" rel="noreferrer"><ExternalLink size={16} /> 네이버 카페</a></li>
            <li><a href="https://blog.naver.com/kjb7533" target="_blank" rel="noreferrer"><ExternalLink size={16} /> 공식 블로그</a></li>
          </ul>
        </section>
      </div>
      <div className="footer-bottom">© 2026 Anseong Kendo. All rights reserved.</div>
    </footer>
  )
}

function HomePage({ posts }) {
  const notices = posts.filter((post) => post.isPublished && post.type === 'notice')
  const galleryPosts = posts.filter((post) => post.isPublished && post.type === 'gallery')

  return (
    <div>
      <section className="hero-section section">
        <div className="container hero-copy">
          <span className="pill">대한검도회 공인 우수도장</span>
          <h1>바른 예절과 강한 집중력<br /><span>아이의 성장은 하루 1시간에서 시작됩니다.</span></h1>
          <p>
            검도는 단순한 운동이 아니라 아이의 자세, 예절, 자신감을 세우는 교육입니다.
            흔들리지 않는 내면의 힘을 길러주세요.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="button button-primary">무료 체험 수련 신청</a>
            <a href="#achievements" className="button button-secondary">도장 실적 보기</a>
          </div>
        </div>
        <div className="container hero-image-wrap">
          <div className="hero-image-card">
            <img src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=1600" alt="아이들 검도 수련 모습" />
          </div>
        </div>
      </section>

      <section id="intro" className="section white-section">
        <div className="container two-column">
          <div className="profile-placeholder">관장님 프로필 사진 영역</div>
          <div>
            <div className="section-kicker">DIRECTOR's MESSAGE</div>
            <h2>30여 년 전통, 진검베기의 대가 김중배 관장님이 이끄는 안성 유일 대한검도회 공인도장</h2>
            <div className="accent-line" />
            <p>
              안성검도관은 30여 년간 검도의 본질을 지켜온 전통 있는 도장입니다.
              우리는 단순한 스포츠가 아니라 <strong>인격 성장과 예의 교육</strong>을 중심으로 삶의 태도를 바로 세우는 수련을 지향합니다.
            </p>
            <p>
              아이들에게는 <strong>바른 인성과 기초 체력</strong>을,
              성인들에게는 <strong>자기 수양과 활력</strong>을 제공합니다.
            </p>
            <blockquote>
              "검도를 통해 삶의 자세를 배우고, 자기 자신을 단련하는 과정이 무엇보다 중요합니다."
              <span>- 관장 김중배</span>
            </blockquote>
            <div className="tag-row">
              <span className="tag">대한검도회 공인</span>
              <span className="tag">안성시 대표 배출</span>
            </div>
          </div>
        </div>
      </section>

      <section id="achievements" className="section dark-section">
        <div className="container">
          <div className="section-header centered light">
            <Trophy size={44} />
            <h2>명예의 전당</h2>
            <p>안성검도관은 확실한 성과로 증명합니다.</p>
          </div>
          <div className="achievement-grid">
            <div>
              <h3 className="subheading">관장 주요 이력</h3>
              <div className="card-stack">
                {ACHIEVEMENTS.filter((item) => item.category === '관장경력').map((item) => (
                  <article key={item.id} className="achievement-card">
                    <span>{item.year}</span>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h3 className="subheading">도장 주요 실적</h3>
              <div className="card-stack">
                {ACHIEVEMENTS.filter((item) => item.category === '도장실적').map((item) => (
                  <article key={item.id} className="achievement-card">
                    <span>{item.year}</span>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="section muted-section">
        <div className="container">
          <div className="section-header centered">
            <div className="section-kicker">PROGRAMS & PRICING</div>
            <h2>수련 프로그램 및 입관 안내</h2>
            <p>연령별 맞춤 지도와 투명한 수납 시스템으로 운영됩니다.</p>
          </div>

          <div className="program-grid">
            <article className="info-card">
              <h3>초등부 / 유치부</h3>
              <p>집중력 향상과 바른 예절, 기초 체력 형성에 집중합니다.</p>
              <ul>
                <li>오후 2:30 ~ 3:30</li>
                <li>오후 4:30 ~ 5:30</li>
              </ul>
            </article>
            <article className="info-card featured-card">
              <h3>중고등부</h3>
              <p>호구 대련과 체력 단련, 단급 심사 및 각종 준비를 진행합니다.</p>
              <ul>
                <li>오후 6:30 ~ 7:30</li>
                <li>오후 8:00 ~ 9:00</li>
              </ul>
            </article>
            <article className="info-card">
              <h3>성인부</h3>
              <p>자기 수양, 스트레스 해소, 생활 체육 대회 출전을 지원합니다.</p>
              <ul>
                <li>오후 8:00 ~ 9:00</li>
                <li>주 3~5회 자유 선택 수련</li>
              </ul>
            </article>
          </div>

          <div className="pricing-grid">
            <article className="price-panel dark-panel">
              <h3><Wallet size={20} /> 입관비 및 월 관비 안내</h3>
              <p>입관비 및 도복/장비 비용은 별도 문의 바랍니다. 부서별 월 관비가 상이합니다.</p>
              <div className="inner-panel">
                <h4>도장 할인 혜택</h4>
                <ul>
                  <li><CheckCircle2 size={16} /> 형제 / 남매 / 자매 동반 등록 시 할인</li>
                  <li><CheckCircle2 size={16} /> 장기 등록 할인</li>
                  <li><CheckCircle2 size={16} /> 특별 할인은 방문 상담 시 안내</li>
                </ul>
              </div>
            </article>
            <article className="price-panel">
              <h3><CreditCard size={20} /> 편리한 결제 수단</h3>
              <p>학부모님의 편의를 위해 다양한 결제 방식을 모두 지원합니다.</p>
              <div className="payment-grid">
                <div>모든 카드 결제</div>
                <div>안성 지역화폐</div>
                <div>제로페이</div>
                <div>계좌 이체</div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="gallery" className="section white-section">
        <div className="container">
          <div className="gallery-head">
            <div>
              <h2>도장 소식 및 갤러리</h2>
              <p>안성검도관의 생생한 수련 모습과 최신 공지를 확인하세요.</p>
            </div>
            <div className="gallery-links">
              <a href="https://cafe.naver.com/ansungkumdo" target="_blank" rel="noreferrer" className="button button-primary">네이버 카페</a>
              <a href="https://blog.naver.com/kjb7533" target="_blank" rel="noreferrer" className="button button-secondary">공식 블로그</a>
            </div>
          </div>

          <div className="gallery-grid">
            <article className="notice-card">
              <div className="notice-title"><Bell size={18} /> 최신 공지사항</div>
              <div className="notice-list">
                {notices.slice(0, 3).map((post) => (
                  <div key={post.id} className="notice-item">
                    <span>{post.createdAt}</span>
                    <strong>{post.title}</strong>
                  </div>
                ))}
              </div>
              <a href="https://cafe.naver.com/ansungkumdo" target="_blank" rel="noreferrer" className="notice-more">
                공지사항 전체보기 <ArrowRight size={14} />
              </a>
            </article>

            {galleryPosts.slice(0, 2).map((post) => (
              <article key={post.id} className="gallery-card">
                <div className="gallery-image">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} />
                  ) : (
                    <div className="image-fallback"><ImageIcon size={28} /></div>
                  )}
                  <span className="gallery-date">{post.createdAt}</span>
                </div>
                <div className="gallery-body">
                  <h3>{post.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="container centered">
          <h2>우리아이, 검도와 잘 맞을까요?</h2>
          <p>도복 없이 편한 복장으로 오셔서 1일 체험을 진행해 보세요.</p>
          <div className="contact-box">
            <div className="contact-icon"><Phone size={30} /></div>
            <div>
              <small>방문 및 입관 상담 문의</small>
              <div className="phone-number">0507-1387-6760</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AdminLoginPage({ setAdminUser, navigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    if (email === 'admin@kendo.com' && password === '1234') {
      setAdminUser({ email, role: 'admin' })
      navigate('/admin/dashboard')
      return
    }
    alert('아이디 또는 비밀번호가 일치하지 않습니다.')
  }

  return (
    <section className="admin-login-screen">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-badge"><Lock size={24} /></div>
        <h1>운영자 로그인</h1>
        <p>관장님 전용 관리 페이지입니다.</p>
        <label>
          이메일 (데모: admin@kendo.com)
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          비밀번호 (데모: 1234)
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="button button-dark full-width" type="submit">로그인</button>
      </form>
    </section>
  )
}

function AdminDashboardPage({
  members,
  tuitions,
  posts,
  toggleMemberActive,
  toggleTuitionPaid,
  updateTuitionAmount,
  addMember,
  addPost,
}) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const currentDate = new Date('2026-03-01')
  const currentMonthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
  const currentMonthDisplay = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`

  return (
    <section className="dashboard-screen">
      <div className="dashboard-shell container narrow">
        <div className="dashboard-header">
          <span className="dashboard-badge">관리자 모드</span>
          <div className="dashboard-month">{currentMonthDisplay}</div>
          <h1>도장 통합 관리</h1>
          <p>관원 상태와 이번 달 수납을 간단하게 관리합니다.</p>
        </div>

        <div className="tab-row">
          <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}>관원 및 관비 관리</button>
          <button className={activeTab === 'posts' ? 'tab active' : 'tab'} onClick={() => setActiveTab('posts')}>소식 등록</button>
        </div>

        {activeTab === 'dashboard' ? (
          <AdminMobileDashboard
            members={members}
            tuitions={tuitions}
            currentMonthStr={currentMonthStr}
            toggleMemberActive={toggleMemberActive}
            toggleTuitionPaid={toggleTuitionPaid}
            updateTuitionAmount={updateTuitionAmount}
            addMember={addMember}
          />
        ) : (
          <AdminPostsTab posts={posts} addPost={addPost} />
        )}
      </div>
    </section>
  )
}

function AdminMobileDashboard({
  members,
  tuitions,
  currentMonthStr,
  toggleMemberActive,
  toggleTuitionPaid,
  updateTuitionAmount,
  addMember,
}) {
  const [editingRecord, setEditingRecord] = useState(null)
  const [isAddingMember, setIsAddingMember] = useState(false)

  const unifiedData = useMemo(() => members.map((member) => {
    const record = tuitions.find((tuition) => tuition.memberId === member.id && tuition.billingMonth === currentMonthStr)
    return { member, record }
  }), [members, tuitions, currentMonthStr])

  const stats = useMemo(() => {
    let billed = 0
    let paid = 0
    unifiedData.filter(({ member }) => member.active).forEach(({ member, record }) => {
      if (record) {
        billed += record.finalAmount
        paid += record.paidAmount
      } else {
        billed += member.baseTuition
      }
    })
    const unpaid = billed - paid
    const rate = billed > 0 ? Math.round((paid / billed) * 100) : 0
    return { billed, paid, unpaid, rate }
  }, [unifiedData])

  return (
    <div className="dashboard-body">
      <div className="stats-grid">
        <StatCard label="이번 달 총 청구액" value={`${stats.billed.toLocaleString()}원`} />
        <StatCard label="현재 수납 완료액" value={`${stats.paid.toLocaleString()}원`} strong="blue" />
        <StatCard label="미납 잔액" value={`${stats.unpaid.toLocaleString()}원`} strong="red" />
        <StatCard label="수납률" value={`${stats.rate}%`} strong="green" />
      </div>

      <div className="section-row between">
        <h2>전체 관원 목록 ({members.length}명)</h2>
        <button className="button button-secondary" onClick={() => setIsAddingMember((prev) => !prev)}>+ 새 관원 등록</button>
      </div>

      {isAddingMember && (
        <div className="panel">
          <AdminNewMemberForm addMember={addMember} onClose={() => setIsAddingMember(false)} />
        </div>
      )}

      <div className="member-list">
        {unifiedData.map(({ member, record }) => {
          const finalAmount = record ? record.finalAmount : member.baseTuition
          const discountAmount = record ? record.discountAmount : 0
          const isPaid = record && record.paymentStatus === 'paid'

          return (
            <article key={member.id} className={member.active ? 'member-card' : 'member-card inactive'}>
              <div className="member-top">
                <div>
                  <div className="member-title-row">
                    <h3>{member.name}</h3>
                    <span>{member.ageGroup}</span>
                  </div>
                  <div className="price-meta">
                    <div>기본: {member.baseTuition.toLocaleString()}원</div>
                    {discountAmount > 0 && <div className="blue">할인: -{discountAmount.toLocaleString()}원</div>}
                    <div className="strong">청구액: {finalAmount.toLocaleString()}원</div>
                  </div>
                </div>
                {member.active && (
                  <button className="edit-button" onClick={() => setEditingRecord({ member, record })}>
                    <Edit3 size={16} />
                    <span>금액수정</span>
                  </button>
                )}
              </div>

              <div className="member-actions">
                <button className={member.active ? 'status-button active-green' : 'status-button muted'} onClick={() => toggleMemberActive(member.id)}>
                  {member.active ? '현재 수련중' : '비활성 (퇴관)'}
                </button>
                {member.active ? (
                  <button className={isPaid ? 'status-button active-blue' : 'status-button danger-outline'} onClick={() => toggleTuitionPaid(record?.id, member.id, currentMonthStr, member.baseTuition)}>
                    {isPaid ? '이번달 납부완료' : '이번달 미납'}
                  </button>
                ) : (
                  <div className="status-button disabled-box">수련 안함</div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {editingRecord && (
        <AdminAmountModal
          data={editingRecord}
          currentMonthStr={currentMonthStr}
          onClose={() => setEditingRecord(null)}
          onSave={(updates) => {
            if (!editingRecord.record) {
              alert("미납/납부 버튼을 먼저 한번 눌러 이번 달 데이터를 생성한 뒤 수정해주세요.")
              setEditingRecord(null)
              return
            }
            updateTuitionAmount(editingRecord.record.id, updates)
            setEditingRecord(null)
          }}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, strong = '' }) {
  const className = strong ? `stat-value ${strong}` : 'stat-value'
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={className}>{value}</div>
    </div>
  )
}

function AdminAmountModal({ data, currentMonthStr, onClose, onSave }) {
  const { member, record } = data
  const [discount, setDiscount] = useState(record ? record.discountAmount : 0)
  const [reason, setReason] = useState(record ? record.discountReason : '')
  const [paidAmount, setPaidAmount] = useState(record ? record.paidAmount : 0)
  const [memo, setMemo] = useState(record ? record.memo : '')

  if (!record) {
    return (
      <div className="modal-backdrop">
        <div className="modal-card compact">
          <div className="modal-info"><Info size={28} /></div>
          <h3>이번 달 데이터가 없습니다.</h3>
          <p>카드에서 '미납' 또는 '납부완료' 버튼을 한 번 눌러 이번 달 데이터를 생성한 후 금액을 수정해주세요.</p>
          <button className="button button-dark full-width" onClick={onClose}>확인</button>
        </div>
      </div>
    )
  }

  const baseAmount = record.baseAmount
  const finalAmount = Math.max(0, Number(baseAmount) - Number(discount || 0))

  const handleSave = () => {
    let paymentStatus = 'unpaid'
    const paid = Number(paidAmount || 0)
    if (paid >= finalAmount) paymentStatus = 'paid'
    else if (paid > 0) paymentStatus = 'partial'

    onSave({
      discountAmount: Number(discount || 0),
      finalAmount,
      paidAmount: paid,
      paymentStatus,
      discountReason: reason,
      memo,
      paidAt: paymentStatus === 'paid' ? new Date().toISOString() : null,
    })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3>{member.name} 관비 상세 수정</h3>
            <small>{currentMonthStr} 기준</small>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body">
          <div className="summary-box">
            <span>기본 책정 관비</span>
            <strong>{baseAmount.toLocaleString()}원</strong>
          </div>

          <label>
            할인 적용 금액 (원)
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </label>

          <label>
            할인 사유
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="예: 형제 할인" />
          </label>

          <div className="summary-box green-box">
            <span>최종 청구액</span>
            <strong>{finalAmount.toLocaleString()}원</strong>
          </div>

          <label>
            실제 수납한 금액 (원)
            <input type="number" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
          </label>

          <div className="quick-actions">
            <button className="chip" onClick={() => setPaidAmount(finalAmount)}>전액입력</button>
            <button className="chip" onClick={() => setPaidAmount(0)}>초기화</button>
          </div>

          <label>
            관리 메모
            <input type="text" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예: 지역화폐 결제" />
          </label>
        </div>

        <div className="modal-footer">
          <button className="button button-secondary full-width" onClick={onClose}>취소</button>
          <button className="button button-primary full-width" onClick={handleSave}>저장하기</button>
        </div>
      </div>
    </div>
  )
}

function AdminNewMemberForm({ addMember, onClose }) {
  const [newMember, setNewMember] = useState({ name: '', ageGroup: '초등부', baseTuition: 150000 })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!newMember.name.trim()) {
      alert('이름을 입력해주세요.')
      return
    }
    addMember(newMember)
    onClose()
  }

  const handleAgeGroupChange = (value) => {
    let baseTuition = 150000
    if (value === '중등부') baseTuition = 160000
    if (value === '고등부' || value === '성인부') baseTuition = 170000
    setNewMember((prev) => ({ ...prev, ageGroup: value, baseTuition }))
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <h3>신규 관원 등록</h3>
      <label className="full-span">
        이름
        <input type="text" value={newMember.name} onChange={(e) => setNewMember((prev) => ({ ...prev, name: e.target.value }))} placeholder="홍길동" />
      </label>
      <label>
        부서
        <select value={newMember.ageGroup} onChange={(e) => handleAgeGroupChange(e.target.value)}>
          <option value="초등부">초등부</option>
          <option value="중등부">중등부</option>
          <option value="고등부">고등부</option>
          <option value="성인부">성인부</option>
        </select>
      </label>
      <label>
        기본 관비 설정
        <input type="number" value={newMember.baseTuition} onChange={(e) => setNewMember((prev) => ({ ...prev, baseTuition: Number(e.target.value) }))} />
      </label>
      <div className="form-actions full-span">
        <button type="button" className="button button-secondary full-width" onClick={onClose}>취소</button>
        <button type="submit" className="button button-dark full-width">등록하기</button>
      </div>
    </form>
  )
}

function AdminPostsTab({ posts, addPost }) {
  const [form, setForm] = useState({ type: 'notice', title: '', content: '', imageUrl: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }
    addPost(form)
    setForm({ type: 'notice', title: '', content: '', imageUrl: '' })
  }

  return (
    <div className="panel">
      <h2>소식 및 갤러리 등록</h2>
      <p className="panel-description">홈페이지 메인에 노출될 공지사항과 대표 사진을 등록합니다.</p>

      <form className="form-grid post-form" onSubmit={handleSubmit}>
        <label>
          유형
          <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
            <option value="notice">공지</option>
            <option value="gallery">갤러리</option>
          </select>
        </label>
        <label className="full-span">
          제목
          <input type="text" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
        </label>
        <label className="full-span">
          내용
          <textarea value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} rows="4" />
        </label>
        <label className="full-span">
          이미지 URL (갤러리일 때만 사용)
          <input type="text" value={form.imageUrl} onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))} />
        </label>
        <div className="form-actions full-span">
          <button className="button button-dark full-width" type="submit">+ 새 소식 저장</button>
        </div>
      </form>

      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-row">
            <div>
              <strong>[{post.type === 'notice' ? '공지' : '사진'}] {post.title}</strong>
            </div>
            <span>{post.createdAt}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
