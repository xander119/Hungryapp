package webService;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
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
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import database.entity.Menu;
import database.entity.Restaurant;
import database.entity.RestaurantDAO;
import database.entity.RestaurantLocation;
import database.entity.Review;

@Path("/restaurants")
@Stateless
@Produces(MediaType.APPLICATION_JSON)

public class RestaurantService {
	@EJB
	private RestaurantDAO restaurantDao;
	@EJB
	private RequestInterceptor interceptor;
	
	private static final String SERVER_UPLOAD_LOCATION_FOLDER = "C://JBOSS/jboss-as-7.1.1.Final/standalone/deployments/Hungryapp.war/img";
	//http://examples.javacodegeeks.com/enterprise-java/rest/resteasy/resteasy-file-upload-example/
	@POST
	@Path("/createRestaurant/{managerid}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createRestaurant(@Context HttpHeaders hHeaders,@PathParam("managerid") int managerid,Restaurant r) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity(restaurantDao.createRestaurant(r, managerid)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	
	

	@POST
	@Path("/updloadLogo")
	@Consumes("multipart/form-data")
	public Response uploadFile( MultipartFormDataInput  input,@Context HttpHeaders hHeaders) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
		String fileName = "";

		Map<String, List<InputPart>> formParts = input.getFormDataMap();

		List<InputPart> inPart = formParts.get("file");

		for (InputPart inputPart : inPart) {

			 try {

				// Retrieve headers, read the Content-Disposition header to obtain the original name of the file
				MultivaluedMap<String, String> headers = inputPart.getHeaders();
				fileName = parseFileName(headers);

				// Handle the body of that part with an InputStream
				InputStream istream = inputPart.getBody(InputStream.class,null);

				fileName = SERVER_UPLOAD_LOCATION_FOLDER + fileName;

				saveFile(istream,fileName);

			  } catch (IOException e) {
				e.printStackTrace();
			  }

			}

                String output = "File saved to server location : " + fileName;

		return Response.status(200).entity(output).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}

	// Parse Content-Disposition header to get the original file name
	private String parseFileName(MultivaluedMap<String, String> headers) {

		String[] contentDispositionHeader = headers.getFirst("Content-Disposition").split(";");

		for (String name : contentDispositionHeader) {

			if ((name.trim().startsWith("filename"))) {

				String[] tmp = name.split("=");

				String fileName = tmp[1].trim().replaceAll("\"","");

				return fileName;
			}
		}
		return "randomName";
	}

	// save uploaded file to a defined location on the server
	private void saveFile(InputStream uploadedInputStream,
		String serverLocation) {

		try {
			OutputStream outpuStream = new FileOutputStream(new File(serverLocation));
			int read = 0;
			byte[] bytes = new byte[1024];

			outpuStream = new FileOutputStream(new File(serverLocation));
			while ((read = uploadedInputStream.read(bytes)) != -1) {
				outpuStream.write(bytes, 0, read);
			}
			outpuStream.flush();
			outpuStream.close();
		} catch (IOException e) {

			e.printStackTrace();
		}
	}

	
	@POST
	@Path("/createRestaurantLocation/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createLocationForRest(@Context HttpHeaders hHeaders,@PathParam("id") int id,RestaurantLocation rl){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity(restaurantDao.createLocationForRest(rl, id)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	
	
	@PUT
	@Path("/updateRestaurant")
	public Response updateRestaurantInfo(@Context HttpHeaders hHeaders,Restaurant r) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity( restaurantDao.update(r)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@PUT
	@Path("/updateRestaurantlocation/{restId}")
	public Response updateRestaurantInfo(@Context HttpHeaders hHeaders,RestaurantLocation r,@PathParam("restId") int restId) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity( restaurantDao.updateLocationForRest(r,restId)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@GET
	@Path("/{id}")
	public Restaurant getRestaurantById(@PathParam("id") int id) {
		return restaurantDao.getRestaurantById(id);

	}
	@GET
	@Path("/item/{itemId}")
	public Response getRestaurantByItemId(@PathParam("itemId") int itemId) {
		return Response.status(200).entity(restaurantDao.getRestaurantByItemId(itemId)).build();

	}

	@GET
	@Path("/{id}/orders")
	public Response getRestaurantOrdersById(@Context HttpHeaders hHeaders,@PathParam("id") int id) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity(restaurantDao.getRestaurantOrdersById(id)).build();
		}
		return Response.status(401).entity("Unauthorized").build();

	}
	
	
	@GET
	@Path("/{id}/menus")
	public List<Menu> getRestaurantMenusById(@PathParam("id") int id) {
		return restaurantDao.getRestaurantMenusById(id);

	}

	@GET
	@Path("/location/{locationid}")
	public List<Restaurant> getBranchRestaurantInfoById(
			@PathParam("locationid") int locationid) {
		return restaurantDao.getRestaurantByLocationId(locationid);
		
	}

	@GET
	@Path("/allrestaurant/locations")
	public List<RestaurantLocation> getAllRestaurantLocations() {
		return restaurantDao.getAllLocations();

	}
	@GET
	@Path("/restaurantByLocationId/{locationid}")
	public List<Restaurant> getRestaurantByLocationId(@PathParam("locationid") int locationid){
		return restaurantDao.getRestaurantByLocationId(locationid);
	}

	@GET
	@Path("/{id}/locations")
	public List<RestaurantLocation> getBranchRestaurantsById(
			@PathParam("id") int id) {
		return restaurantDao.getBranchRestaurantsById(id);

	}
	@DELETE
	@Path("/deleteLocation/{locationid}")
	@Produces(MediaType.TEXT_PLAIN)
	public Response deletelocation(@Context HttpHeaders hHeaders,@PathParam("locationid") int locationid) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			restaurantDao.deleteARestaurantLocation(locationid);
			return Response.status(200).entity("{ \"result\": \"Deleted\"}" ).build();
		}
		return Response.status(401).entity("Unauthorized").build();
		
	}
	@DELETE
	@Path("/delete/{restaurantid}")
	@Produces(MediaType.TEXT_PLAIN)
	public Response deleteARestaurant(@Context HttpHeaders hHeaders,@PathParam("restaurantid") int restaurantid) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			restaurantDao.deleteARestaurant(restaurantid);
			return Response.status(200).entity("{ \"result\": \"Deleted\"}" ).build();
		}
		return Response.status(401).entity("Unauthorized").build();
		
	}
}
