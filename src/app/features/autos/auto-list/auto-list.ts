import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AutoService, Auto } from '../../../../core/services/auto.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-auto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auto-list.html',
  styleUrl: './auto-list.css'
})
export class AutoListComponent implements OnInit {
  autos: Auto[] = [];
  loading: boolean = true;
  error: string = '';

  currentImageIndex: Map<number, number> = new Map();

  // ✅ Agrega aquí tus nuevas propiedades del navbar
  isMenuOpen = false;
  isScrolled = false;

  constructor(
    private autoService: AutoService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAutos();

    // ✅ Detecta el scroll para cambiar color del navbar
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
  }

  // ✅ Método para abrir/cerrar el menú
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  cargarAutos(): void {
    this.loading = true;
    this.autoService.getAutos().subscribe({
      next: (autos: Auto[]) => {
        this.autos = autos;
        autos.forEach(auto => {
          this.currentImageIndex.set(auto.id, 0);
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error al cargar los autos';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }
   // Obtener imagen actual de un auto
  getCurrentImage(auto: Auto): string {
    if (!auto.imagenes || auto.imagenes.length === 0) {
      return this.getDefaultImage(auto);
    }
    const index = this.currentImageIndex.get(auto.id) || 0;
    return auto.imagenes[index];
  }

  // Obtener índice de imagen actual
  getCurrentImageIndex(auto: Auto): number {
    return this.currentImageIndex.get(auto.id) || 0;
  }

  // Cambiar a imagen específica
  setCurrentImage(auto: Auto, index: number): void {
    this.currentImageIndex.set(auto.id, index);
  }

  // Siguiente imagen
  nextImage(auto: Auto): void {
    if (!auto.imagenes || auto.imagenes.length === 0) return;
    
    const currentIndex = this.currentImageIndex.get(auto.id) || 0;
    const nextIndex = (currentIndex + 1) % auto.imagenes.length;
    this.currentImageIndex.set(auto.id, nextIndex);
  }

  // Imagen anterior
  prevImage(auto: Auto): void {
    if (!auto.imagenes || auto.imagenes.length === 0) return;
    
    const currentIndex = this.currentImageIndex.get(auto.id) || 0;
    const prevIndex = currentIndex === 0 ? auto.imagenes.length - 1 : currentIndex - 1;
    this.currentImageIndex.set(auto.id, prevIndex);
  }

  // Imagen por defecto si no hay imágenes
  getDefaultImage(auto: Auto): string {
    return `https://via.placeholder.com/400x300/cccccc/666666?text=${auto.marca}+${auto.modelo}`;
  }

  // Manejar error de imagen
  onImageError(event: any, auto: Auto): void {
    event.target.src = this.getDefaultImage(auto);
  }

  logout(): void {
    this.authService.logout();
    // Opcional: recargar la página o redirigir
    window.location.reload();
  }

 // En AutoListComponent, actualizar el método:
  editarAuto(auto: Auto): void {
    this.router.navigate(['/admin/autos/editar', auto.id]);
  }

  eliminarAuto(auto: Auto): void {
    if (confirm(`¿Estás seguro de eliminar el ${auto.marca} ${auto.modelo}?\n\nEsta acción no se puede deshacer.`)) {
      this.autoService.eliminarAuto(auto.id).subscribe({
        next: () => {
          // Mostrar mensaje de éxito
          alert(`✅ ${auto.marca} ${auto.modelo} eliminado correctamente`);
          // Recargar la lista
          this.cargarAutos();
        },
        error: (error) => {
          this.error = 'Error al eliminar el auto';
          console.error('Error:', error);
          alert('❌ Error al eliminar el auto. Verifica la consola para más detalles.');
        }
      });
    }
  }
}