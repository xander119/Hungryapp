package database.entity;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
@Stateless
@LocalBean
@SuppressWarnings("unchecked")
public class MenuDAO {

	@PersistenceContext
	EntityManager em;
	
	public List<Menu> getMenu() {
		// TODO Auto-generated method stub
		List<Menu> m =  em.createNamedQuery("Menu.findById").getResultList();
		return m;
	}

	public Menu createMenu(Menu m) {
		// TODO Auto-generated method stub
		if(m!=null){
			if(m.getItems()!=null){
				for(Item i : m.getItems()){
					i.setMenu(m);
				}
			}
			em.persist(m);
			return m;
		}
		return null;
	}

	public Menu updateMenu(Menu menu) {
		// TODO Auto-generated method stub
		return em.merge(menu);
	}

	public Menu getMenuById(int menuid) {
		// TODO Auto-generated method stub
		return em.find(Menu.class, menuid);
	}

	public void deleteMenu(int menuid) {
		// TODO Auto-generated method stub
		Menu removeMenu =getMenuById(menuid);
		if(removeMenu!=null){
			em.remove(removeMenu);
		}
	}

}
