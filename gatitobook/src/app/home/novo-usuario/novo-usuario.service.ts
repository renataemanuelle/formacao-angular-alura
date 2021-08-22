import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NovoUsuario } from './novo-usuario';

@Injectable({
  providedIn: 'root',
})
export class NovoUsuarioService {
  constructor(private http: HttpClient) {}

  cadastraNovoUsuario(novoUsuario: NovoUsuario): Observable<object> {
    return this.http.post('http://localhost:3000/user/signup', novoUsuario);
  }

  verificaUsuarioExistente(nomeUsuario: string): Observable<object> {
    return this.http.get(`http://localhost:3000/user/exists/${nomeUsuario}`);
  }
}
