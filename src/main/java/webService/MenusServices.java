package webService;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import database.entity.Menu;
import database.entity.MenuDAO;
import database.entity.Restaurant;

@Path("/menus")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class MenusServices {
	@EJB
	private MenuDAO menuDao;
	@EJB
	private RequestInterceptor interceptor;
	@POST
	@Path("/createMenu/{restId}")
	public Response createNewMenu(@Context HttpHeaders hHeaders,@PathParam("restId")int restId,Menu m) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity(menuDao.createMenu(m,restId)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@PUT
	@Path("/updateMenu")
	public Response updateMenu(@Context HttpHeaders hHeaders,Menu menu) {
		//the new menu object should contain reference ID
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity(menuDao.updateMenu(menu)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}

	@GET
	@Path("/{menuid}")
	public Response getMenuById(@PathParam("menuid") int menuid) {
		return Response.status(200).entity(menuDao.getMenuById(menuid)).build();
	}
	@GET
	@Path("/restaurant/{restid}")
	public Response getMenuByRestId(@PathParam("restid") int restid) {
		return Response.status(200).entity(menuDao.getMenuByRestId(restid)).build();

	}


	@DELETE
	@Path("/delete/{menuid}")
	public Response deleteMenu(@Context HttpHeaders hHeaders,@PathParam("menuid") int menuid){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			menuDao.deleteMenu(menuid);
			return Response.status(200).entity("Deleted").build();
		}
		return Response.status(401).entity("Unauthorized").build();
		
	}
}
