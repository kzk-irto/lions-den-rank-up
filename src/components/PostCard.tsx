
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface PostCardProps {
  post: Post;
  onPostDeleted: () => void;
}

export function PostCard({ post, onPostDeleted }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isOwner = user?.id === post.user_id;

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este post?')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);

    if (error) {
      toast({
        title: "Erro ao deletar post",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Post deletado",
        description: "O post foi removido com sucesso."
      });
      onPostDeleted();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(post.created_at)}
          </p>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </CardContent>
    </Card>
  );
}
