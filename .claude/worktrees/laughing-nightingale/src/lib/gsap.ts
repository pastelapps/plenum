import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Global config
gsap.defaults({ ease: 'power3.out' })

export { gsap, ScrollTrigger }

