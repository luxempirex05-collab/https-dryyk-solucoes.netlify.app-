// Sistema de Analytics Invisível - Dryyk Soluções
// Este script rastreia visitantes automaticamente

(function() {
    'use strict';
    
    // Configurações do sistema
    const ANALYTICS_CONFIG = {
        adminUrl: 'admin-dashboard.html',
        trackingEnabled: true,
        sendInterval: 30000, // 30 segundos
        sessionTimeout: 1800000 // 30 minutos
    };
    
    // Dados do visitante
    let visitorData = {
        sessionId: generateSessionId(),
        startTime: new Date().toISOString(),
        currentPage: window.location.pathname.split('/').pop() || 'index.html',
        userAgent: navigator.userAgent,
        screenResolution: screen.width + 'x' + screen.height,
        language: navigator.language,
        referrer: document.referrer,
        ip: null,
        location: null,
        pageViews: [],
        timeOnSite: 0,
        isActive: true
    };
    
    // Gerar ID único da sessão
    function generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Obter informações de geolocalização (simulado)
    function getLocationInfo() {
        // Simulação de dados de localização
        const locations = [
            { city: 'São Paulo', state: 'SP', country: 'BR', ip: '192.168.1.' + Math.floor(Math.random() * 255) },
            { city: 'Rio de Janeiro', state: 'RJ', country: 'BR', ip: '10.0.0.' + Math.floor(Math.random() * 255) },
            { city: 'Belo Horizonte', state: 'MG', country: 'BR', ip: '172.16.0.' + Math.floor(Math.random() * 255) },
            { city: 'Brasília', state: 'DF', country: 'BR', ip: '203.0.113.' + Math.floor(Math.random() * 255) },
            { city: 'Salvador', state: 'BA', country: 'BR', ip: '198.51.100.' + Math.floor(Math.random() * 255) }
        ];
        
        return locations[Math.floor(Math.random() * locations.length)];
    }
    
    // Rastrear visualização de página
    function trackPageView() {
        const pageView = {
            page: visitorData.currentPage,
            timestamp: new Date().toISOString(),
            timeSpent: 0,
            scrollDepth: 0,
            clicks: 0,
            formSubmissions: 0
        };
        
        visitorData.pageViews.push(pageView);
        
        // Salvar no localStorage para persistência
        localStorage.setItem('dryyk_analytics', JSON.stringify(visitorData));
    }
    
    // Rastrear cliques
    function trackClicks() {
        document.addEventListener('click', function(e) {
            const currentPageView = visitorData.pageViews[visitorData.pageViews.length - 1];
            if (currentPageView) {
                currentPageView.clicks++;
            }
            
            // Rastrear cliques em links específicos
            if (e.target.tagName === 'A') {
                const linkData = {
                    type: 'link_click',
                    url: e.target.href,
                    text: e.target.textContent,
                    timestamp: new Date().toISOString()
                };
                
                sendAnalyticsData('event', linkData);
            }
        });
    }
    
    // Rastrear scroll
    function trackScroll() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                const currentPageView = visitorData.pageViews[visitorData.pageViews.length - 1];
                if (currentPageView) {
                    currentPageView.scrollDepth = maxScroll;
                }
            }
        });
    }
    
    // Rastrear formulários
    function trackForms() {
        document.addEventListener('submit', function(e) {
            const currentPageView = visitorData.pageViews[visitorData.pageViews.length - 1];
            if (currentPageView) {
                currentPageView.formSubmissions++;
            }
            
            const formData = {
                type: 'form_submission',
                formId: e.target.id || 'unknown',
                page: visitorData.currentPage,
                timestamp: new Date().toISOString()
            };
            
            sendAnalyticsData('event', formData);
        });
    }
    
    // Detectar quando o usuário sai da página
    function trackPageExit() {
        window.addEventListener('beforeunload', function() {
            const currentPageView = visitorData.pageViews[visitorData.pageViews.length - 1];
            if (currentPageView) {
                currentPageView.timeSpent = Date.now() - new Date(currentPageView.timestamp).getTime();
            }
            
            visitorData.isActive = false;
            localStorage.setItem('dryyk_analytics', JSON.stringify(visitorData));
        });
    }
    
    // Detectar inatividade
    function trackActivity() {
        let lastActivity = Date.now();
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(function(event) {
            document.addEventListener(event, function() {
                lastActivity = Date.now();
                visitorData.isActive = true;
            }, true);
        });
        
        // Verificar inatividade a cada minuto
        setInterval(function() {
            if (Date.now() - lastActivity > 300000) { // 5 minutos
                visitorData.isActive = false;
            }
        }, 60000);
    }
    
    // Enviar dados para o sistema de analytics
    function sendAnalyticsData(type, data) {
        if (!ANALYTICS_CONFIG.trackingEnabled) return;
        
        const payload = {
            type: type,
            sessionId: visitorData.sessionId,
            timestamp: new Date().toISOString(),
            data: data || visitorData
        };
        
        // Simular envio de dados (em produção, seria uma requisição AJAX)
        console.log('📊 Analytics Data:', payload);
        
        // Salvar dados localmente para o painel admin
        let analyticsLog = JSON.parse(localStorage.getItem('dryyk_analytics_log') || '[]');
        analyticsLog.push(payload);
        
        // Manter apenas os últimos 1000 registros
        if (analyticsLog.length > 1000) {
            analyticsLog = analyticsLog.slice(-1000);
        }
        
        localStorage.setItem('dryyk_analytics_log', JSON.stringify(analyticsLog));
    }
    
    // Inicializar sistema de analytics
    function initAnalytics() {
        // Verificar se já existe uma sessão
        const existingData = localStorage.getItem('dryyk_analytics');
        if (existingData) {
            const parsed = JSON.parse(existingData);
            // Se a sessão não expirou, continuar
            if (Date.now() - new Date(parsed.startTime).getTime() < ANALYTICS_CONFIG.sessionTimeout) {
                visitorData = parsed;
                visitorData.currentPage = window.location.pathname.split('/').pop() || 'index.html';
            }
        }
        
        // Obter informações de localização
        const locationInfo = getLocationInfo();
        visitorData.ip = locationInfo.ip;
        visitorData.location = locationInfo;
        
        // Iniciar rastreamento
        trackPageView();
        trackClicks();
        trackScroll();
        trackForms();
        trackPageExit();
        trackActivity();
        
        // Enviar dados iniciais
        sendAnalyticsData('page_view');
        
        // Enviar dados periodicamente
        setInterval(function() {
            if (visitorData.isActive) {
                visitorData.timeOnSite = Date.now() - new Date(visitorData.startTime).getTime();
                sendAnalyticsData('heartbeat');
            }
        }, ANALYTICS_CONFIG.sendInterval);
    }
    
    // Função para acessar dados (apenas para admin)
    window.getDryykAnalytics = function() {
        return {
            currentSession: visitorData,
            allSessions: JSON.parse(localStorage.getItem('dryyk_analytics_log') || '[]'),
            clearData: function() {
                localStorage.removeItem('dryyk_analytics');
                localStorage.removeItem('dryyk_analytics_log');
            }
        };
    };
    
    // Inicializar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalytics);
    } else {
        initAnalytics();
    }
    
    // Adicionar CSS invisível para rastreamento
    const style = document.createElement('style');
    style.textContent = `
        .dryyk-tracker {
            position: absolute;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar elemento rastreador invisível
    const tracker = document.createElement('div');
    tracker.className = 'dryyk-tracker';
    tracker.setAttribute('data-analytics', 'true');
    document.body.appendChild(tracker);
    
})();

// Função para gerar relatórios (apenas para admin)
function generateAnalyticsReport() {
    const data = window.getDryykAnalytics();
    const report = {
        totalSessions: data.allSessions.length,
        uniqueVisitors: new Set(data.allSessions.map(s => s.sessionId)).size,
        pageViews: data.allSessions.filter(s => s.type === 'page_view').length,
        averageTimeOnSite: 0,
        topPages: {},
        locations: {},
        devices: {}
    };
    
    // Calcular estatísticas
    data.allSessions.forEach(session => {
        if (session.data && session.data.pageViews) {
            session.data.pageViews.forEach(pv => {
                report.topPages[pv.page] = (report.topPages[pv.page] || 0) + 1;
            });
        }
        
        if (session.data && session.data.location) {
            const loc = session.data.location.city;
            report.locations[loc] = (report.locations[loc] || 0) + 1;
        }
    });
    
    return report;
}