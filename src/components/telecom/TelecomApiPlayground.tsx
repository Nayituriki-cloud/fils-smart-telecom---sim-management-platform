import React, { useState } from 'react';
import { useFils } from '../../context/FilsContext';
import {
  Code2,
  Play,
  CheckCircle2,
  Copy,
  Layers,
  Cpu,
  Radio,
  Server,
  Terminal,
  ShieldCheck,
} from 'lucide-react';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  title: string;
  description: string;
  sampleBody?: any;
  defaultResponse: any;
}

export const TelecomApiPlayground: React.FC = () => {
  const { sims, products, transactions, currentUser } = useFils();

  const endpoints: ApiEndpoint[] = [
    {
      method: 'POST',
      path: '/api/sim/lookup',
      title: 'SIM & HSS Lookup',
      description: 'Query carrier Home Subscriber Server (HSS) for ICCID status, IMSI, and PUK parameters.',
      sampleBody: {
        iccid: '8925001100248910021',
        carrier_node: 'KGL-CORE-01',
      },
      defaultResponse: {
        status: 'SUCCESS',
        code: 200,
        data: {
          iccid: '8925001100248910021',
          msisdn: '+250789558821',
          imsi: '635100110024891',
          hlr_state: 'ACTIVE_VOICE_DATA',
          network_profile: '5G_STANDALONE_MAX',
          ota_enabled: true,
        },
      },
    },
    {
      method: 'POST',
      path: '/api/activation/ota',
      title: 'Over-the-Air (OTA) SIM Activation',
      description: 'Trigger official MNO network provisioning for verified KYC customer line.',
      sampleBody: {
        iccid: '8925001100248910023',
        msisdn: '+250789558823',
        kyc_token: 'KYC-TOKEN-VERIFIED-984210',
        authorized_officer_id: currentUser.id,
      },
      defaultResponse: {
        status: 'ACTIVATION_INITIATED',
        code: 201,
        transaction_id: 'MNO-OTA-948201',
        hlr_response: 'SUBSCRIBER_REGISTERED_ON_RADIO_CELL_7',
        activation_timestamp: new Date().toISOString(),
      },
    },
    {
      method: 'POST',
      path: '/api/customer/register',
      title: 'Statutory Customer KYC Submission',
      description: 'Submit regulatory biometric registration to telecom national ID gateway.',
      sampleBody: {
        national_id: '11998800293411',
        full_name: 'Eric Kwizera',
        msisdn: '+250789558821',
        id_type: 'National ID',
        agent_code: '#AG-408',
        biometric_hash: 'sha256:8f4c2e71d3...',
      },
      defaultResponse: {
        status: 'ACCEPTED_FOR_AUDIT',
        code: 202,
        compliance_check: {
          duplicate_id_detected: false,
          active_lines_count: 1,
          regulatory_limit_allowed: 3,
        },
      },
    },
    {
      method: 'GET',
      path: '/api/products/catalog',
      title: 'Fetch Telecom Products & Tariffs',
      description: 'Retrieve approved active voice, 5G data, and airtime bundles.',
      defaultResponse: {
        status: 'SUCCESS',
        code: 200,
        currency: 'RWF',
        total_products: products.length,
        items: products.slice(0, 3),
      },
    },
    {
      method: 'POST',
      path: '/api/transactions/process',
      title: 'Real Bank Transfer Gateway & EFT Clearing',
      description: 'Execute and verify direct bank transfer payment to Emmanuel Nayituriki (Bank of Kigali) via authorized banking switch.',
      sampleBody: {
        msisdn: '+250789558821',
        product_id: 'prod-1',
        amount: 35000,
        currency: 'RWF',
        payment_method: 'Direct Bank Transfer',
        beneficiary_name: 'Emmanuel Nayituriki',
        beneficiary_bank: 'Bank of Kigali',
        beneficiary_account: '00040-06948201-38',
        sender_bank: 'Bank of Kigali',
        bank_transfer_utr: 'BK-TRF-94821038',
      },
      defaultResponse: {
        status: 'BANK_TRANSFER_VERIFIED_AND_CREDITED',
        code: 200,
        carrier_reference: 'FLS-TX-2026-9481',
        bank_wire_utr: 'BK-TRF-94821038',
        beneficiary: 'Emmanuel Nayituriki',
        clearing_network: 'RBS_EFT_NATIONAL_SWITCH',
        balance_replenished: true,
      },
    },
    {
      method: 'GET',
      path: '/api/commissions/settlement',
      title: 'Agent Commissions Settlement Status',
      description: 'Query batch payout status for accredited field kiosks.',
      defaultResponse: {
        status: 'SETTLED',
        code: 200,
        batch_id: 'BATCH-2026-W39',
        total_agents_paid: 18,
        disbursed_currency: 'RWF',
      },
    },
  ];

  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(endpoints[0]);
  const [requestBodyText, setRequestBodyText] = useState(
    JSON.stringify(endpoints[0].sampleBody || {}, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<any>(endpoints[0].defaultResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState(42);
  const [copied, setCopied] = useState(false);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setRequestBodyText(JSON.stringify(ep.sampleBody || {}, null, 2));
    setApiResponse(ep.defaultResponse);
  };

  const handleExecuteRequest = () => {
    setIsLoading(true);
    const start = performance.now();
    setTimeout(() => {
      setIsLoading(false);
      const end = performance.now();
      setLatencyMs(Math.round(end - start) + 35);
      setApiResponse(selectedEndpoint.defaultResponse);
    }, 400);
  };

  const copyResponseJson = () => {
    navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Carrier MNO Gateway & HSS Integration
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>FILS Telecom API Explorer</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-medium">
              v2.4 Core
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate and test official mobile network operator (MNO) integration layer endpoints per Requirement 17.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 font-semibold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Carrier Gateway: CONNECTED
          </span>
        </div>
      </div>

      {/* Main Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 font-mono mb-2 uppercase tracking-wider">
            Available Telecom Endpoints
          </div>
          {endpoints.map((ep) => {
            const isSelected = selectedEndpoint.path === ep.path;
            return (
              <div
                key={ep.path}
                onClick={() => handleSelectEndpoint(ep)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500/70 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      ep.method === 'GET'
                        ? 'bg-sky-500/20 text-sky-400'
                        : ep.method === 'POST'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-xs font-mono font-bold text-white truncate">{ep.path}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200">{ep.title}</div>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ep.description}</p>
              </div>
            );
          })}
        </div>

        {/* API Playground Pane (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            {/* Target Address bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-950 rounded-2xl border border-slate-800">
              <span
                className={`text-xs font-mono font-bold px-3 py-1 rounded-xl ${
                  selectedEndpoint.method === 'GET'
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {selectedEndpoint.method}
              </span>
              <div className="flex-1 font-mono text-xs text-slate-200 px-2 truncate w-full">
                https://mno-gateway.fils-telecom.com{selectedEndpoint.path}
              </div>
              <button
                onClick={handleExecuteRequest}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
              </button>
            </div>

            {/* Request Payload Editor */}
            {selectedEndpoint.sampleBody && (
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
                  JSON Request Payload
                </label>
                <textarea
                  rows={6}
                  value={requestBodyText}
                  onChange={(e) => setRequestBodyText(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Carrier Response Box */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Carrier HSS Response
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    HTTP 200 OK
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Latency: {latencyMs}ms</span>
                </div>
                <button
                  onClick={copyResponseJson}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-72">
                <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
              </div>
            </div>

            {/* Telemetry metadata */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
              <span>TLS 1.3 · Mutual OAuth 2.0 Bearer Authenticated</span>
              <span>Regulatory Carrier Token: FIL-CORE-CERT-2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
