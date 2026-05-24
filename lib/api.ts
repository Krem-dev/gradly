const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const api = {
  auth: {
    register: async (email: string, password: string, fullName: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      })
      return response.json() as Promise<ApiResponse<{ id: number; email: string; fullName: string; plan: string }>>
    },

    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      return response.json() as Promise<ApiResponse<{ id: number; email: string; fullName: string; plan: string }>>
    },

    getProfile: async (userId: number) => {
      const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`)
      return response.json() as Promise<ApiResponse<{ id: number; email: string; fullName: string; plan: string; createdAt: string }>>
    },

    changePassword: async (userId: number, currentPassword: string, newPassword: string, confirmPassword: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentPassword, newPassword, confirmPassword })
      })
      return response.json() as Promise<ApiResponse<null>>
    },

    deleteAccount: async (userId: number, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      })
      return response.json() as Promise<ApiResponse<null>>
    },

    sendOTP: async (email: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      return response.json() as Promise<ApiResponse<null>>
    },

    verifyOTP: async (email: string, otp: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      return response.json() as Promise<ApiResponse<null>>
    },

    forgotPassword: async (email: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      return response.json() as Promise<ApiResponse<null>>
    },

    resetPassword: async (email: string, newPassword: string, confirmPassword: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword, confirmPassword })
      })
      return response.json() as Promise<ApiResponse<null>>
    }
  },

  shs: {
    calculateAggregate: async (grades: string[]) => {
      const response = await fetch(`${API_BASE_URL}/shs/calculate-aggregate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grades })
      })
      return response.json() as Promise<ApiResponse<{ aggregate: number; best6Grades: number[]; totalSubjects: number }>>
    },

    getRecommendations: async (grades: string[], subjects: Array<{ name: string; grade: string }>, userPlan: string = 'free', filters: any = {}) => {
      const response = await fetch(`${API_BASE_URL}/shs/get-recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grades, subjects, userPlan, filters })
      })
      return response.json() as Promise<ApiResponse<{
        aggregate: number
        totalEligible: number
        recommendations: Array<{
          id: number
          university: string
          program: string
          category: string
          cutoff: number
          studentScore: number
          margin: number
          requiredSubjects: string[]
        }>
        showUpgradePrompt: boolean
      }>>
    },

    saveConversion: async (userId: number, grades: string[], subjects: Array<{ name: string; grade: string }>, result: any) => {
      const response = await fetch(`${API_BASE_URL}/shs/save-conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, grades, subjects, result })
      })
      return response.json() as Promise<ApiResponse<{ id: number }>>
    }
  },

  converter: {
    convertCWAToCGPA: async (percentage: number) => {
      const response = await fetch(`${API_BASE_URL}/converter/convert-cwa-to-cgpa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentage })
      })
      return response.json() as Promise<ApiResponse<{ percentage: number; cgpa: number; gradeEquivalent: string }>>
    },

    saveConversion: async (userId: number, percentage: number, cgpa: number, courses: any[]) => {
      const response = await fetch(`${API_BASE_URL}/converter/save-conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, percentage, cgpa, courses })
      })
      return response.json() as Promise<ApiResponse<{ id: number }>>
    }
  },

  universityConverter: {
    convert: async (
      sourceSystem: string,
      courses: any[],
      targetSystem: string,
      userId?: number | string,
      sourceUniversity?: string
    ) => {
      const uid = userId ?? (typeof window !== 'undefined' ? localStorage.getItem('userId') : null)
      const response = await fetch(`${API_BASE_URL}/university-converter/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(uid ? { 'x-user-id': String(uid) } : {}),
        },
        body: JSON.stringify({
          sourceSystem,
          sourceUniversity, // KNUST | UG | UCC | UEW — backend uses to pick the right classification table
          courses,
          targetSystem,
          userId: uid,
        }),
      })
      return response.json() as Promise<ApiResponse<{
        sourceSystem: string
        sourceUniversity: string | null
        sourceScore: number
        weightedAverage: number
        ghanaCgpa: number | null            // internal university CGPA (null for KNUST)
        ghanaClassification: string | null  // First Class / Second Class Upper / ...
        usaGpa: number                      // WES/Scholaro 4.0 GPA for US grad apps
        ukPercentage: number
        targetSystem: string
        targetScore: number
        degreeClassification: {
          sourceClassification: string
          sourceUniversity?: string
          usaEquivalent?: string
          ukEquivalent?: string
        }
        totalCourses: number
        totalCredits: number
        courses: any[]
        warnings: string[]
      }>>
    },

    save: async (userId: number, conversionData: any) => {
      const response = await fetch(`${API_BASE_URL}/university-converter/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, conversionData })
      })
      return response.json() as Promise<ApiResponse<{ conversionId: number }>>
    },

    getHistory: async (userId: number) => {
      const response = await fetch(`${API_BASE_URL}/university-converter/history/${userId}`)
      return response.json() as Promise<ApiResponse<any[]>>
    },

    getGradingSystems: async () => {
      const response = await fetch(`${API_BASE_URL}/university-converter/grading-systems`)
      return response.json() as Promise<ApiResponse<any>>
    }
  },

  dashboard: {
    getStats: async (userId: number) => {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats/${userId}`)
      return response.json() as Promise<ApiResponse<{
        user: { id: number; email: string; fullName: string; plan: string; createdAt: string }
        stats: { totalConversions: number }
      }>>
    },

    getConversions: async (userId: number, limit: number = 10, offset: number = 0) => {
      const response = await fetch(`${API_BASE_URL}/dashboard/conversions/${userId}?limit=${limit}&offset=${offset}`)
      return response.json() as Promise<ApiResponse<Array<{
        id: number
        userId: number
        type: string
        inputData: any
        result: any
        createdAt: string
      }>>>
    },

    deleteConversion: async (conversionId: number, source: 'shs' | 'university' = 'shs') => {
      // `source` tells the backend which table the conversion lives in. Without it
      // the legacy `conversions` (SHS) table is targeted; university conversions
      // need source='university' or the delete is a no-op (or worse, wrong row).
      const response = await fetch(
        `${API_BASE_URL}/dashboard/conversion/${conversionId}?source=${encodeURIComponent(source)}`,
        { method: 'DELETE' }
      )
      return response.json() as Promise<ApiResponse<null>>
    }
  },

  admin: {
    universities: {
      create: async (data: { name: string; location: string; region: string; website: string }) => {
        const response = await fetch(`${API_BASE_URL}/admin/universities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        return response.json() as Promise<ApiResponse<{ id: number }>>
      },

      getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/universities`)
        return response.json() as Promise<ApiResponse<Array<{ id: number; name: string; location: string; region: string; website: string; createdAt: string }>>>
      },

      update: async (id: number, data: any) => {
        const response = await fetch(`${API_BASE_URL}/admin/universities/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        return response.json() as Promise<ApiResponse<null>>
      },

      delete: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/admin/universities/${id}`, {
          method: 'DELETE'
        })
        return response.json() as Promise<ApiResponse<null>>
      }
    },

    programs: {
      create: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/admin/programs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        return response.json() as Promise<ApiResponse<{ id: number }>>
      },

      getByUniversity: async (universityId: number) => {
        const response = await fetch(`${API_BASE_URL}/admin/programs/${universityId}`)
        return response.json() as Promise<ApiResponse<any[]>>
      },

      update: async (id: number, data: any) => {
        const response = await fetch(`${API_BASE_URL}/admin/programs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        return response.json() as Promise<ApiResponse<null>>
      },

      delete: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/admin/programs/${id}`, {
          method: 'DELETE'
        })
        return response.json() as Promise<ApiResponse<null>>
      }
    },
  },

  credits: {
    getBalance: async (userId: number) => {
      const r = await fetch(`${API_BASE_URL}/credits/balance/${userId}`)
      return r.json() as Promise<ApiResponse<{ balance: number }>>
    },
    getHistory: async (userId: number, limit = 20) => {
      const r = await fetch(`${API_BASE_URL}/credits/history/${userId}?limit=${limit}`)
      return r.json() as Promise<ApiResponse<Array<{
        id: number; delta: number; reason: string; balance_after: number;
        reference: string | null; metadata: any; created_at: string
      }>>>
    },
  },

  payments: {
    getPricing: async () => {
      const r = await fetch(`${API_BASE_URL}/payments/pricing`)
      return r.json() as Promise<ApiResponse<{
        pack: string; creditsPerPack: number; priceMajor: number;
        pricePesewas: number; currency: string; publicKey: string
      }>>
    },
    init: async (userId: number, email: string, callbackUrl?: string) => {
      const r = await fetch(`${API_BASE_URL}/payments/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, callbackUrl }),
      })
      return r.json() as Promise<ApiResponse<{
        reference: string; authorizationUrl: string; accessCode: string;
        amountPesewas: number; credits: number; publicKey: string
      }>>
    },
    verify: async (reference: string) => {
      const r = await fetch(
        `${API_BASE_URL}/payments/verify/${encodeURIComponent(reference)}`
      )
      return r.json() as Promise<ApiResponse<{
        success: boolean; alreadyFulfilled: boolean; status: string; balance: number | null
      }>>
    },
  },
}
